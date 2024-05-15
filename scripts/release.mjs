
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import pico from 'picocolors'
import semver from 'semver'
import enquirer from 'enquirer'
import { execa } from 'execa'


const args = minimist(process.argv.slice(2), {
  alias: {
    skipBuild: 'skip-build',
    skipTests: 'skip-tests',
    skipGit: 'skip-git',
    skipPrompts: 'skip-prompts'
  }
})
let versionUpdated = false
const packageJSON = createRequire(import.meta.url)('../package.json')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const currentVersion = packageJSON.version
const { prompt } = enquirer

// preId为alpha(内部测试版)、beta()、rc 这些预发布版tag
const preId = args.preid || semver.prerelease(currentVersion)?.[0]
const isDryRun = args.dry
/** @type {boolean | undefined} */
let skipTests = args.skipTests
const skipBuild = args.skipBuild
const skipPrompts = args.skipPrompts
const skipGit = args.skipGit
const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId
    ? /** @type {const} */ (['prepatch', 'preminor', 'premajor', 'prerelease'])
    : []),
]
const inc = (/** @type {import('semver').ReleaseType} */ i) =>
  semver.inc(currentVersion, i, preId)
const run = async (
  /** @type {string} */ bin,
  /** @type {ReadonlyArray<string>} */ args,
  /** @type {import('execa').Options} */ opts = {},
) => execa(bin, args, { stdio: 'inherit', ...opts })

const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))
  .filter((p) => {
    const pkgRoot = path.resolve(__dirname, '../packages', p)
    // 只处理 packages下的文件夹
    if (fs.statSync(pkgRoot).isDirectory()) {
      const pkg = JSON.parse(
        fs.readFileSync(path.resolve(pkgRoot, 'package.json'), 'utf-8')
      )
      return !pkg.private
    }
  })


async function main() {
  // 同步远程
  if (!await isInSyncWithRemote(packageJSON.repository.url)) {
    return
  } else {
    console.log(`${pico.green(`✓`)} commit is up-to-date with remote.\n`)
  }

  let targetVersion = args._[0]

  if (!targetVersion) {
    // no explicit version, offer suggestions
    /** @type {{ release: string }} */
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements
        .map(i => `${i} (${inc(i)})`)
        .concat(['custom']),
    })

    if (release === 'custom') {
      /** @type {{ version: string }} */
      const result = await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
      targetVersion = result.version
    } else {
      targetVersion = release.match(/\((.*)\)/)?.[1] ?? ''
    }
  }

  // console.log(semver.valid(targetVersion))
  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version ${targetVersion}`)
  }

  if (!skipPrompts) {
    /** @type {{ yes: boolean }} */
    const { yes: confirmRelease } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing v${targetVersion}. Confirm?`,
    })

    if (!confirmRelease) {
      return
    }
  }


  if (!skipTests) {
    console.log(`Testing all packages... `)
    await run('pnpm', ['run', 'test'])
  } else {
    console.log('Tests skipped')
  }

  console.log('\nUpdating cross dependencies...')
  updateVersions(targetVersion)
  versionUpdated = true

  console.log(`Building all packages... `)
  if (!skipBuild) {
    await run('pnpm', ['run', 'build'])
  } else {
    console.log('Build skipped')
  }

  // generate changelog
  console.log('\nGenerating changelog...')
  await run(`pnpm`, ['run', 'changelog'])

  if (!skipPrompts) {
    /** @type {{ yes: boolean }} */
    const { yes: changelogOk } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Changelog generated. Does it look good?`,
    })

    if (!changelogOk) {
      return
    }
  }


  if (!skipGit) {
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      console.log('\nCommitting changes...')
      await run('git', ['add', '-A'])
      await run('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit.')
    }
  }

  console.log('\nPublishing packages...')

  const additionalPublishFlags = []

  // bypass the pnpm --publish-branch restriction which isn't too useful to us
  // otherwise it leads to a prompt and blocks the release script
  const branch = await getBranch()
  if (branch !== 'main') {
    additionalPublishFlags.push('--publish-branch', branch)
  }
  // npm publish
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion, additionalPublishFlags)
  }

  // push to GitHub
  if (!skipGit) {
    console.log('\nPushing to GitHub...')
    await run('git', ['tag', `v${targetVersion}`])
    await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    await run('git', ['push'])
  }

  console.log(`✓success release:v${targetVersion}`)
}

async function getSha() {
  return (await execa('git', ['rev-parse', 'HEAD'])).stdout
}
async function getBranch() {
  return (await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])).stdout
}

async function isInSyncWithRemote(url) {
  try {
    const branch = await getBranch()
    const repoName = /github.com\/(.*)\.git/.exec(url)?.[1]
    if (!repoName) return false
    const res = await fetch(
      `https://api.github.com/repos/${repoName}/commits/${branch}?per_page=1`,
    )
    const data = await res.json()
    if (data.sha === (await getSha())) {
      return true
    } else {
      /** @type {{ yes: boolean }} */
      const { yes } = await prompt({
        type: 'confirm',
        name: 'yes',
        message: pico.red(
          `Local HEAD is not up-to-date with remote. Are you sure you want to continue?`,
        ),
      })
      return yes
    }
  } catch(e) {
    console.log(e)
    console.error(
      pico.red('Failed to check whether local HEAD is up-to-date with remote.'),
    )
    return false
  }
}

const keepThePackageName = (/** @type {string} */ pkgName) => pkgName

/**
 * @param {string} version
 * @param {(pkgName: string) => string} getNewPackageName
 */
function updateVersions(version, getNewPackageName = keepThePackageName) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version, getNewPackageName)
  // 2. update all packages
  packages.forEach((p) =>
    updatePackage(getPkgRoot(p), version, getNewPackageName)
  )
}

/**
 * @param {string} pkg
 */
function getPkgRoot(pkg) {
  return path.resolve(__dirname, '../packages/' + pkg)
}

/**
 * @param {string} pkgRoot
 * @param {string} version
 * @param {(pkgName: string) => string} getNewPackageName
 */
function updatePackage(pkgRoot, version, getNewPackageName) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  /** @type {Package} */
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = getNewPackageName(pkg.name)
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

/**
 * @param {string} pkgName
 * @param {string} version
 * @param {ReadonlyArray<string>} additionalFlags
 */
async function publishPackage(pkgName, version, additionalFlags) {
  console.log(`Publishing ${pkgName}...`)

  let releaseTag = null
  if (args.tag) {
    releaseTag = args.tag
  } else if (version.includes('alpha')) {
    releaseTag = 'alpha'
  } else if (version.includes('beta')) {
    releaseTag = 'beta'
  } else if (version.includes('rc')) {
    releaseTag = 'rc'
  }


  try {
    // Don't change the package manager here as we rely on pnpm to handle
    // workspace:* deps
    await run(
      'pnpm',
      [
        'publish',
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public',
        '--no-git-checks',
        ...additionalFlags
        // TODO
        // '--dry-run'
      ],
      {
        cwd: getPkgRoot(pkgName),
        stdio: 'pipe'
      }
    )
    console.log(`Successfully published ${pkgName}@${version}`)
  } catch (/** @type {any} */ e) {
    if (e && e.stderr && e.stderr.match(/previously published/)) {
      console.log(`Skipping already published: ${pkgName}`)
    } else {
      throw e
    }
  }
}

main().catch((err) => {
  if (versionUpdated) {
    // 失败时 回滚到当前版本
    updateVersions(currentVersion)
  }
  console.error(err)
  process.exit(1)
})

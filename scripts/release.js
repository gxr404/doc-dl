const fs = require('node:fs')
const path = require('node:path')
const minimist = require('minimist')
const semver = require('semver')

const packageJSON = require('../package.json')

const argv = minimist(process.argv.slice(2), {
  alias: {
    skipBuild: 'skip-build',
    skipTests: 'skip-tests',
    skipGit: 'skip-git',
    skipPrompts: 'skip-prompts'
  }
})
let versionUpdated = false
const currentVersion = packageJSON.version

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

/**
 * @param {string} bin
 * @param {ReadonlyArray<string>} args
 * @param {import('execa').Options} opts
 */
async function run(bin, args, opts) {
  const { execa } = await import('execa')
  console.log(execa)
  return execa(bin, args, { stdio: 'inherit', ...opts })
}

async function main() {
  const targetVersion = argv._[0]
  console.log(semver.valid(targetVersion))
  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version ${targetVersion}`)
  }
  if (semver.lte(targetVersion, currentVersion)) {
    throw new Error(
      `invalid target version: ${targetVersion} <= ${currentVersion}`
    )
  }
  console.log(`Releasing v${targetVersion}...`)

  if (!argv.skipTests) {
    console.log(`Testing all packages... `)
    await run('pnpm', ['run', 'test', '--run'])
  } else {
    console.log('Tests skipped')
  }

  updateVersions(targetVersion)
  versionUpdated = true

  if (!argv.skipBuild) {
    console.log(`Building all packages... `)
    await run('pnpm', ['run', 'build'])
  } else {
    console.log('Build skipped')
  }

  // generate changelog
  console.log('\nGenerating changelog...')
  await run(`pnpm`, ['run', 'changelog'])

  if (!argv.skipGit) {
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      console.log('\nCommitting changes...')
      await run('git', ['add', '-A'])
      await run('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit.')
    }
  }

  // npm publish
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion)
  }

  // push to GitHub
  if (!skipGit) {
    console.log('\nPushing to GitHub...')
    // await runIfNotDry('git', ['tag', `v${targetVersion}`])
    // await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    const token = process.env.GH_TOKEN
    await run(
      'git',
      ['push'].concat(
        token
          ? [`https://gxr404:${token}@github.com/gxr404/article-pull.git`]
          : []
      )
    )
  }

  console.log(`✓success release:v${targetVersion}`)
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
  try {
    // Don't change the package manager here as we rely on pnpm to handle
    // workspace:* deps
    await run(
      'pnpm',
      [
        'publish',
        '--access',
        'public',
        // TODO
        '--dry-run'
      ],
      {
        cwd: getPkgRoot(pkgName),
        stdio: 'pipe'
      }
    )
    console.log(pico.green(`Successfully published ${pkgName}@${version}`))
  } catch (/** @type {any} */ e) {
    if (e.stderr.match(/previously published/)) {
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

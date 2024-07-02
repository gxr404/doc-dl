import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import genLazyLoadImage from './rules/lazyLoadImage'
import hexoCodeBlock from './rules/hexoCodeBlock'
import noScript from './rules/noScript'
import wechatCodeBlock from './rules/wechatCodeBlock'
import ibmCodeBlock from './rules/ibmCodeBlock'
import mediumCodeBlock from './rules/mediumCodeBlock'
import csdnCodeBlock from './rules/csdnCodeBlock'
import yuqueTableCard from './rules/yuqueTableCard'
import mediumImage from './rules/mediumImage'
import genZhihuGif from './rules/zhihuGif'
import gcoresGallery from './rules/gcoresGallery'
import typoraCodeBlock from './rules/typoraCodeBlock'
import juejinCodeBlock from './rules/juejinCodeBlock'
import strong from './rules/tag/strong'
import syntaxhighlighter from './rules/syntaxhighlighter'
import infoq_code from './rules/infoq_code'
import wechatCodeBlock_02 from './rules/wechatCodeBlock_02'

export default function plugins(turndownService: TurndownService) {
  return turndownService.use([
    gfm,
    genLazyLoadImage,
    hexoCodeBlock,
    noScript,
    wechatCodeBlock,
    wechatCodeBlock_02,
    ibmCodeBlock,
    mediumCodeBlock,
    csdnCodeBlock,
    yuqueTableCard,
    mediumImage,
    genZhihuGif,
    gcoresGallery,
    typoraCodeBlock,
    juejinCodeBlock,
    strong,
    syntaxhighlighter,
    infoq_code
  ])
}

import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import lazyLoadImage from './lazyLoadImage'
import hexoCodeBlock from './hexoCodeBlock'
import noScript from './noScript'
import wechatCodeBlock from './wechatCodeBlock'
import ibmCodeBlock from './ibmCodeBlock'
import mediumCodeBlock from './mediumCodeBlock'
import csdnCodeBlock from './csdnCodeBlock'
import yuqueTableCard from './yuqueTableCard'
import mediumImage from './mediumImage'
import zhihuGif from './zhihuGif'
import gcoresGallery from './gcoresGallery'
import typoraCodeBlock from './typoraCodeBlock'
import juejinCodeBlock from './juejinCodeBlock'
import strong from './tag/strong'
import syntaxhighlighter from './syntaxhighlighter'
import infoq_code from './infoq_code'
import wechatCodeBlock_02 from './wechatCodeBlock_02'

export default function plugins(turndownService: TurndownService) {
  turndownService.use([
    gfm,
    lazyLoadImage,
    hexoCodeBlock,
    noScript,
    wechatCodeBlock,
    wechatCodeBlock_02,
    ibmCodeBlock,
    mediumCodeBlock,
    csdnCodeBlock,
    yuqueTableCard,
    mediumImage,
    zhihuGif,
    gcoresGallery,
    typoraCodeBlock,
    juejinCodeBlock,
    strong,
    syntaxhighlighter,
    infoq_code
  ])
}

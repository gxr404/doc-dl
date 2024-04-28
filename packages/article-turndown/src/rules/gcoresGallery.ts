import * as TurndownService from 'turndown'

export default function (turndownService: TurndownService): void {
  turndownService.addRule('gcoresGallery', {
    filter: (node) => {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
        return false
      }
      if (node.tagName !== 'FIGURE') {
        return false
      }
      const { className } = node
      if (
        typeof className !== 'string' ||
        !className.includes('story_block-atomic-gallery')
      ) {
        return false
      }
      return true
    },
    replacement: function (content: string, node: HTMLElement) {
      if (!(node instanceof Object)) {
        // TODO node instanceof HTMLElement
        return content
      }
      const galleryItem = node.querySelectorAll('.gallery_item')
      if (!galleryItem || galleryItem.length <= 0) {
        return content
      }
      let imageCount = galleryItem.length
      const galleryIndex = node
        .querySelector('.gallery_indexOf')
        ?.querySelectorAll('span')
      if (galleryIndex && galleryIndex[1]) {
        imageCount =
          parseInt(galleryIndex[1].textContent!, 10) || galleryItem.length
      }
      const title = node.querySelector('.story_caption')?.textContent
      const code = Array.from(galleryItem)
        .slice(0, imageCount)
        .map((o) => {
          const href = o.getAttribute('href')
          const gallery_imageCaption = o.querySelector(
            '.gallery_imageCaption'
          )?.textContent
          return `![${gallery_imageCaption ?? title ?? ''}](${href})`
        })
        .join('\n')
      return `${code}\n`
    }
  })
}

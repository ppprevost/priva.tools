import { useCallback } from 'react';

export type TextItem = {
  str: string;
  transform: [number, number, number, number, number, number];
  width: number;
  height: number;
};

type UsePdfTextLayerReturn = {
  renderTextLayer: (
    pageIndex: number,
    viewport: { width: number; height: number; scale: number; transform: number[] },
    container: HTMLDivElement,
  ) => Promise<TextItem[]>;
};

let pdfjsReady: Promise<typeof import('pdfjs-dist')> | null = null;

const getPdfjs = () => {
  if (!pdfjsReady) {
    pdfjsReady = Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ]).then(([mod, workerModule]) => {
      mod.GlobalWorkerOptions.workerSrc = workerModule.default;
      return mod;
    });
  }
  return pdfjsReady;
};

export function usePdfTextLayer(pdfDocRef: React.RefObject<import('pdfjs-dist').PDFDocumentProxy | null>): UsePdfTextLayerReturn {
  const renderTextLayer = useCallback(
    async (
      pageIndex: number,
      viewport: { width: number; height: number; scale: number; transform: number[] },
      container: HTMLDivElement,
    ): Promise<TextItem[]> => {
      const doc = pdfDocRef.current;
      if (!doc) return [];

      const pdfjs = await getPdfjs();
      const page = await doc.getPage(pageIndex + 1);
      const pageViewport = page.getViewport({ scale: viewport.scale });
      const textContent = await page.getTextContent();

      container.innerHTML = '';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = `${pageViewport.width}px`;
      container.style.height = `${pageViewport.height}px`;

      const layer = new pdfjs.TextLayer({ textContentSource: textContent, container, viewport: pageViewport });
      await layer.render();

      return textContent.items
        .filter((item): item is import('pdfjs-dist/types/src/display/api').TextItem => 'str' in item)
        .map((item) => ({
          str: item.str,
          transform: item.transform as [number, number, number, number, number, number],
          width: item.width,
          height: item.height,
        }));
    },
    [pdfDocRef],
  );

  return { renderTextLayer };
}

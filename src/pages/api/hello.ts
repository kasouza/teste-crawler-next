// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Chromium from 'chrome-aws-lambda'

export type Data = {
  title: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let browser = null
  let result = null

  const url = req.query['url'] || 'https://example.com'

  try {
    browser = await Chromium.puppeteer.launch({
      args: Chromium.args,
      defaultViewport: Chromium.defaultViewport,
      executablePath: await Chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage()
    if (Array.isArray(url)) {
      await page.goto(url[0])
    } else {
      await page.goto(url)
    }

    result = await page.title()

  } catch (error) {
    console.error(error)

  } finally {
    if (browser !== null) {
      browser.close()
    }
  }

  if (result !== null) {
    res.status(200).json({ title: result })
  } else {
    res.status(500).json({ title: '' })
  }
}

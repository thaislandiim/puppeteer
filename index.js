import fetch from 'node-fetch'
import puppeteer from 'puppeteer'

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

const url = 'https://crosp.org.br/wp-json/wp/v2/posts'
const getPostPage = async (page) => {
    //per page = 100 (retorna até 100 posts por pagina)
    const json = await (await fetch(url + '?page=' +  page + "&per_page=100")).json()
    return json
}

const pages = 24
const posts = []

for (let index = 0; index < pages; index++) {
    const page = index + 1
    //console.log(page)
    const postsPage = await getPostPage(page)
    //console.log(postsPage.length)
    //percorre todos as paginas
    posts.push(...postsPage)
}

//puppeteer para retornar os elementos
const browser = await puppeteer.launch({
    headless: false,
    args: [
        '--start-maximized'
    ]
})

for (let index = 0; index < posts.length; index++) {
    const post = posts[index]
    const link = post.link

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 961 })
    await page.goto(link)
    await sleep(3000)
    await page.close()
}

// const browser = await puppeteer.launch()
// const page = await browser.newPage()

// await page.goto('https://developer.chrome.com/')
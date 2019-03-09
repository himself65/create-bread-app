import './main.styl'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app') || document.createElement('div')
  app.innerHTML = `
  <div>
    <span>hello, world</span>
    <br/>
    <a href="https://github.com/himself65">Himself65 Github</a>
  </div>
  `
})

document.addEventListener('loadend', () => {
  console.log('ts-web loaded.')
})

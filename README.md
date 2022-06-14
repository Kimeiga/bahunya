<p align="center">
  <img src="src/bahunya-logo.png" alt="bahunya logo">
</p>

# Bahunya

A *classless* CSS framework with a *navbar* and *dark styling* for around 10.46 kB.

Use it by pasting the following into your `<head>`

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kimeiga/bahunya/dist/bahunya.min.css">
```

Now write your web app with semantic html elements and watch it look pretty right out of the box, no css classes needed!

### Goal of the Project

The ultimate goal of Bahunya is to be a CSS "framework" that can provide almost everything you really need for a web app or website without introducing any new CSS classes at all. 

I observed that many of the most common UI elements in websites can be wholly described by semantic HTML elements rather than `<div>`'s with classes. What's more is that most CSS frameworks tend to style these elements very similarly. So why not remove the classes altogether and use semantic html elements (`<nav>`, `<main>`, etc), which can help improve accessiblity for screen readers, and also make the website source easier to read and write for developers.

That's the north star of this project: to get as far as possible toward that goal without introducing classes (this will mean Bahunya might not have a grid system or other things where classes needed). If you have ideas on more things to add without classes, feel free to contribute!

* * *

How to make the navbar
----------------------

Example:

```html
<nav>
  <a href="/">Bahunya</a>
  <a href="/test.html">test</a>
  <a href="/markdown.html">markdown</a>
</nav>
```

What about a navbar with nested lists?

```html
<nav>
  <ul>
    <li>
      <a href="#text">Text</a>
      <ul>
          <li><a href="#text__headings">Headings</a></li>
          <li><a href="#text__paragraphs">Paragraphs</a></li>
          <li><a href="#text__blockquotes">Blockquotes</a></li>
          ...
      </ul>
    </li>
    <li>
      <a href="#embedded">Embedded content</a>
      <ul>
          <li><a href="#embedded__images">Images</a></li>
          <li><a href="#embedded__audio">Audio</a></li>
          <li><a href="#embedded__video">Video</a></li>
          ...
      </ul>
    </li>
    <li>
      <a href="#forms">Form elements</a>
      <ul>
          <li><a href="#forms__input">Input fields</a></li>
          <li><a href="#forms__select">Select menus</a></li>
          <li><a href="#forms__checkbox">Checkboxes</a></li>
          ...
      </ul>
    </li>
  </ul>
</nav>
```

As you can see, the navbar works whether you use a unordered list with sub-unordered-lists (`<ul>`'s with `<li>`'s) or if you just put the `<a>`'s right under the main `<nav>`. Both work, although I think the latter option might be better for screen readers.




## To develop locally:

`yarn`

`yarn dev`

## To build:

`yarn build`

### Mini Post-mortem

I wrote about this framework in the DevX publication on Medium!

https://medium.com/ucladevx/i-created-a-10kb-classless-css-framework-5d5eff56837d

If you are a computer science student at UCLA looking for a collection software team to hone your skills on a real-world project, feel free to apply!

http://ucladevx.com/

### Thanks

Huge thanks to [Kognise](https://www.kognise.dev/) and all the folks behind [Water.css](https://watercss.kognise.dev/). Bahunya needed an enourmous facelift, and I was able to bootstrap (hehe) a lot of work from water.css. 

Huge thanks to [Yegor Bugayenko](https://www.yegor256.com/) and [Filipe Freire](https://filfreire.com/) for creating [Tacit](https://yegor256.github.io/tacit/), a fantastic classless CSS framework that inspired this project.

As for me, I'm [Kimeiga](https://hakanalpay.com) and I made this to help me get web apps off the ground without worrying too much styling.

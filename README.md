<p align="center">
  <img src="bahunya-logo.png" alt="bahunya logo">
</p>

# Bahunya

10KB classless CSS framework with responsive typography, navbar, syntax highlighting, and much more!

## To use:

Just include the following in your `head`

```html
<link rel="stylesheet" href="https://cdn.rawgit.com/kimeiga/bahunya/css/bahunya-0.1.2.css" />
```

Visit the [website](https://kimeiga.github.io/bahunya/) for instructions on activating the navbar and syntax highlighting.

If you have semantically correct html, it should just work! No CSS classes needed :).

## To develop locally:

`npm start`

(which runs `parcel index.html`)

It will be available at `localhost:1234`

## To build:

`npm run build`

(which runs `parcel build index.html --out-dir docs --public-url ./`)

## Branches

Development is taking place on the master branch. Github Pages website is being served from the `docs` folder on the master branch for convenience.
Minified CSS files for importing are hosted on the `css` branch and served with RawGit.

### Mini Post-mortem

I wrote about this framework in the DevX publication on Medium!

https://medium.com/ucladevx/i-created-a-10kb-classless-css-framework-5d5eff56837d

If you are a computer science student at UCLA looking for a collection software team to hone your skills on a real-world project, feel free to apply!

http://ucladevx.com/

### Thanks

Huge thanks to [Yegor Bugayenko](https://www.yegor256.com/) and [Filipe Freire](https://filfreire.com/) for creating [Tacit](https://yegor256.github.io/tacit/), a fantastic classless CSS framework that inspired this project. I felt that Tacit was good, but I wanted responsive typography, vertical rhythm, a navbar, better web safe fonts, dark color theme, code syntax highlighting, and more. So I made Bahunya!

Tacit version 1.3.2 is 6kb, and Bahunya is 10kb, so I've only added 4kb for all these other features!

Thanks to [Morris Fuller Benton](https://www.linotype.com/682/morris-fuller-benton.html) for designing Century Schoolbook in 1919, Bahunya's beautiful web-safe serif headings font.

Thanks to Eric Gill for creating Gill Sans in 1926, Bahunya's elegant web-safe sans-serif body font.

Thanks to [Luc(as) de Groot](https://www.lucasfonts.com/home/) for designing Consolas around 2006, Bahunya's legible monospace font.

All fonts have fallbacks for Windows/Mac/Linux font diversion.

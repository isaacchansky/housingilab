# Housing Innovation Lab: Housing Development toolkit
> Repo for Placeful's Real Estate Development Educational WebApp for the City of Boston's Housing Innovation Lab

This project is a specifically configured [Jekyll](https://jekyllrb.com/docs/) project. For interactivity, it uses [Typescript](https://www.typescriptlang.org/) with [ThreeJS](https://threejs.org/examples/).


## Quick Start
Ensure you have [nodeJS](https://nodejs.org/) `v7.8.0` and [ruby](https://www.ruby-lang.org/en/) `v2.5` installed.

Install dependencies (from project root):
```
bundle install
npm install
```

To build the typescript:
```
npm run build
```

To build the Jekyll site:
```
bundle exec jekyll build
```

## Working on things
Generally you want things to re-build as you work. The following commands will watch for file changes and rebuild the typescript and jekyll site respectively.

To do that, open two termials:
Rebuild typescript in termial 1
```
npm run build-watch
```

Rebuild jekyll in terminal 2
```
bundle exec jekyll serve
```

## Structure
### If you want to adjust content:
The directories you care about are `_posts`, `_includes`, and `_data`.

The 'header' section of the site is in and HTML file `_includes/hero.html`.

The lesson modules are the core content, and they exist in the `_posts` directory. These adhere to Jekyll conventions, please consult [Jekyll docs around posts](https://jekyllrb.com/docs/posts/).
The metadata we rely on is:
- `title`, this is the headline title for the lesson, and used in navigation.
- `order`, this defines the order in which the lessons are presented.
- `isLesson`, this lets us differentiate between lesson content with options which change interactivity, and the openning 'intro' or closing 'take action' sections.

Paired with each lesson, are `lessonOptions`. This relies in `_data/lessonOptions.yml`. These are ordered by key (i, 1,2,3) which are paired with the lesson `order` metadata to generate the options displayed for each lesson.

### Change site title, description, feedback link
Various configuration items are stored in `_config.yml`. You can adjust these by changing the items and rebuilding the site.

### To swap out images
You will see images linked within the markdown files for various lessons. These images are stored in the `images/` direcotry.


## To deploy
There is a script in the root of this directory called `deploy-to-gh-pages.sh`. This hosts the built site on a [github repository's gh-pages branch](https://help.github.com/articles/what-is-github-pages/).

*note:* The current set up assumes a github pages url that has a path of `https://______.github.io/housingilab`. Unless where you are deploying also has a subpath of `housingilab`, be sure to update the `baseurl` in the `_config.yml`, and anywhere it is used in the SCSS, HTML, and markdown.

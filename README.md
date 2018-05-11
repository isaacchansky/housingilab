# Housing Innovation Lab: Housing Development toolkit
> Repo for Placeful's Real Estate Development Educational WebApp for the City of Boston's Housing Innovation Lab

This project is a specifically configured [Jekyll](https://jekyllrb.com/docs/posts/) project. For interactivity, it uses [Typescript](https://www.typescriptlang.org/) with [ThreeJS](https://threejs.org/examples/).


## Quick Start
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
Generally you want things to re-build as you work.
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
Lesson modules are the core content, they exist in the `_posts` directory. These adhere to Jekyll conventions, please consult [Jekyll docs around posts](https://jekyllrb.com/docs/posts/).
Definitions live in `_data` directory. This is a YAML file that eventually is used via javascript to define content.
Additional site content and configuration can be found in `_config.yml`

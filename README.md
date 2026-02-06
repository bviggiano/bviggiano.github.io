# [`bviggiano.github.io`](https://bviggiano.github.io)

This repository contains the source code for my personal website.

Thanks to [alshedivat](https://github.com/alshedivat) for providing the outstanding site template, which is available [here](https://github.com/alshedivat/al-folio).

## How to preview and edit locally

### First time installation instructions

See [INSTALL.md](INSTALL.md#deployment) for instructions on how to deploy the site using GitHub Actions.

When first deploying the site, make sure you follow all of the instructions in the section titled "Enabling automatic deployment".

### To preview locally

To preview the site locally, run:

```bash
./preview_locally.sh
```

This will start Docker Desktop (if needed), pull the latest images, and open your browser.

The site will be available at [http://0.0.0.0:8080](http://0.0.0.0:8080)

### To preview locally (no Docker)

If you can't install Docker, you can run the site natively with Ruby and Jekyll.

**1. Install rbenv and ruby-build:**

```bash
brew install rbenv ruby-build
```

**2. Install Ruby 3.3.5:**

```bash
rbenv install 3.3.5
rbenv local 3.3.5
```

**3. Install dependencies and serve:**

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

The site will be available at [http://localhost:4000](http://localhost:4000)

> **Note:** You may also need to install ImageMagick (`brew install imagemagick`) for responsive image generation, and Jupyter (`pip install jupyter`) if you have notebook content.

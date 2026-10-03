# [`bviggiano.github.io`](https://bviggiano.github.io)

This repository contains the source code for my personal website.

Thanks to [alshedivat](https://github.com/alshedivat) for providing the outstanding site template, which is available [here](https://github.com/alshedivat/al-folio).

## How to preview and edit locally

### First time installation instructions

See [al-folio's INSTALL guide](https://github.com/alshedivat/al-folio/blob/main/docs/INSTALL.md) for instructions on how to deploy the site using GitHub Actions.

When first deploying the site, make sure you follow all of the instructions in the section titled "Enabling automatic deployment".

### To preview locally (with Docker)

**0. Install Docker Desktop (one-time setup):**

You only need to do this once. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for [Mac](https://docs.docker.com/desktop/setup/install/mac-install/), [Windows](https://docs.docker.com/desktop/setup/install/windows-install/), or [Linux](https://docs.docker.com/desktop/setup/install/linux/). On a Mac, you can also install it with Homebrew:

```bash
brew install --cask docker
```

**1. Run the preview script (each time you preview):**

```bash
./preview_locally.sh
```

This will start Docker Desktop (if needed), pull the latest images, and open your browser.

The site will be available at [http://0.0.0.0:8080](http://0.0.0.0:8080)

### To preview locally (no Docker)

If you can't install Docker, you can run the site natively with Ruby and Jekyll.

#### One-time setup

**0. Install rbenv and ruby-build:**

```bash
brew install rbenv ruby-build
```

**1. Install Ruby 3.3.5:**

```bash
rbenv install 3.3.5
rbenv local 3.3.5
```

**2. Install dependencies:**

```bash
gem install bundler
bundle install
```

Rerun `bundle install` whenever the `Gemfile` changes (for example, after merging upstream updates).

#### Each time you preview

**3. Serve the site:**

```bash
bundle exec jekyll serve
```

The site will be available at [http://localhost:4000](http://localhost:4000)

> **Note:** You may also need to install ImageMagick (`brew install imagemagick`) for responsive image generation, and Jupyter (`pip install jupyter`) if you have notebook content.

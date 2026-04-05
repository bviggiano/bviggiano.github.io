---
layout: post
title: How to get set up on a new machine
date: 2026-03-28
description: A guide for configuring your set up on a cluster, from SSH keys to conda environments to git authentication.
tags:
  - how-to
og_image: /assets/img/cluster-setup-hero.png
header_image: assets/img/cluster-setup-hero.gif
header_tile_image: assets/img/cluster-setup-hero.png
toc:
  sidebar: left
---

One of the most common questions I get from students just starting out in AI/ML research or computational biology is how to get set up on that new computational cluster they just got access to. Over the years, I've done this enough times that I started keeping a step-by-step guide I follow every time I get access to a new system to ensure I complete every step of my process. After getting a few requests to help with this in the last few weeks, I decided to publish my guide as a note here.

There are a few important things to keep in mind when reading this:

1. These are all just preferences! There are many tools you can use and many ways to get set up on a cluster. This is mostly just what I prefer.
2. This is not a static document and I don't treat it as such! Over the years I've added quite a bit to it as my practices change or as I find new shortcuts, and with the incredible new abilities of modern AI tools, it's been changing much more rapidly.

<small>I hope you find this helpful or learn a trick or two. Additionally, if you have thoughts on a better way to do _anything_ in this note, please don't hesitate to [tell me about it here](https://github.com/bviggiano/bviggiano.github.io/issues/new)! Cheers!</small>

## Step 0: Set up a coding agent of your choice

Before we do anything with the cluster, the number one piece of advice I can give is _use a coding agent_. They are amazingly helpful and can likely do a lot of the steps in this document for you if you give them this note as an input. My personal favorite is [Claude Code](https://claude.ai/code), Anthropic's CLI tool for working with Claude directly in the terminal. To get started:

1. Head to [claude.ai](https://claude.ai) and create an account if you don't have one already.
2. Subscribe to a [Pro or Max plan](https://claude.ai/upgrade). This is orders of magnitude cheaper than paying per-token through the API, and it gives you generous Claude Code usage. (You _can_ also use an [API key](https://console.anthropic.com/) if you prefer, but the subscription is the way to go for most people.)
3. Install Claude Code on your local machine by running `curl -fsSL https://claude.ai/install.sh | bash`, then launch it with `claude`.

I would set this up on your local machine before we even get started. We'll also set it up on the cluster itself in [Step 4](#step-4-set-up-claude-code).

## Step 1: Test your SSH connection

Before we start configuring anything, let's make sure you can actually connect to the cluster. You'll need two things: your **username** (the one assigned by the cluster, which may not be the same as your local machine's username) and the cluster's **hostname**. The hostname is the network address of the cluster's login server, and it's usually provided in the welcome email or onboarding docs you received when your account was created. Some examples from Stanford are `sc.stanford.edu` (SAIL) and `login.sherlock.stanford.edu` (Sherlock).

Throughout this doc, I'll use a few different Stanford clusters as examples. Open a terminal on your local machine and try connecting:

```bash
# ssh <username>@<hostname>
ssh viggiano@login.sherlock.stanford.edu
```

You should be prompted for your password. Enter it, and if everything is working you'll land in a shell on the cluster. Type `exit` to disconnect and come back to your local machine. If this doesn't work, double check the hostname and username with whoever gave you access!

Now that we know the connection works, we can move on to getting set up!

## Step 2: Add the cluster to your SSH config

Typing out `ssh <username>@hostname` every time you want to connect is really annoying, and hostnames are generally annoyingly hard to remember. Instead, we can define short nicknames for various clusters through the use of an SSH config file.

1. _On your local machine_, open (or create) the `~/.ssh/config` file:

   ```bash
   vim ~/.ssh/config
   ```

2. Add an entry for the cluster you are getting set up that looks like this:

   ```text
   Host sherlock  # <-- This is the nickname the cluster will use!
       HostName login.sherlock.stanford.edu  # <-- The hostname
       User viggiano                         # <-- Your cluster username (may not be the same as your local username)
   ```

Now we can connect with just:

```bash
ssh sherlock
```

This nickname also works with `scp`, `rsync`, `sftp`, and any other tool that uses SSH under the hood. IDEs like VSCode/Cursor will also automatically pick up all of your configured hosts, so the cluster will appear in their Remote SSH dropdown as an option to connect to.

You can add as many entries as you want:

```
Host sumo
    HostName sumo.stanford.edu
    User viggiano

Host sail
    HostName sc.stanford.edu
    User viggiano
```

## Step 3: Set up SSH keys

Next we will set up our `ssh keys`! Every time you connect to a cluster, the server needs to verify that you are who you say you are. By default, this means typing your password on every single connection. SSH keys let you skip that entirely. They work using a **key pair**: a private key that stays on your local machine and a public key that you give to the cluster. Once the cluster has your public key, it can verify your identity automatically. **NOTE:** Some clusters do not allow this step or handle it for you automatically. This is common on shared systems where admins enforce password-based or two-factor authentication for security. Notably, Stanford's Sherlock cluster does not support SSH key authentication.

<details markdown="1">
<summary>Quick Aside: Setting up SSH Keys</summary>

SSH keys live in the `~/.ssh/` directory on your local machine. You can check what's there by running:

```bash
$ ls -al ~/.ssh/
```

If you already have ssh keys, you will most likely see something like the following:

- `id_ed25519` is your **private key**. _Never share this with anyone._
- `id_ed25519.pub` is your **public key**. This is what you copy to remote servers.
- `known_hosts` this is an auto-maintained file that keeps track of servers you've connected to before.

If you don't see any keys, you should create one using the `ssh-keygen` command:

```bash
ssh-keygen -t ed25519
```

(When running `ssh-keygen`, press Enter through the prompts to accept the default file location and skip the passphrase.)

Your public key is just a single line of text:

```bash
$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... bviggiano@local-machine
```

Your private key will look like this and should **never** be shared:

```bash
$ cat ~/.ssh/id_ed25519
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAA...
...many more lines...
-----END OPENSSH PRIVATE KEY-----
```

</details>

Once you have a key pair, you can run `ssh-copy-id` _from your local machine_ to automatically copy your public key to the cluster:

```bash
# ssh-copy-id <cluster-nickname>
ssh-copy-id sail
```

You'll be asked for your password one last time. After that, you should be able to connect without it.

## Step 4: Set up Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's CLI tool for working with Claude directly in your terminal. It can help you navigate unfamiliar codebases, debug issues, write scripts, and even run through the remaining steps in this guide interactively.

Some clusters have it pre-installed as a **module**. Modules are a system that cluster admins use to manage shared software installations so that users don't have to install common tools themselves. Before installing anything on a cluster, it's worth checking whether it's already available as a module.

<details markdown="1">
<summary>Quick Aside: The module system</summary>

Here are some useful commands for working with modules:

```bash
module avail              # List all available modules
module spider <name>      # Search for a specific module (e.g., module spider python)
module load <name>        # Load a module into your current session
module list               # Show currently loaded modules
```

Some modules have dependencies on other modules. For example, you might need to `module load biology` before you can `module load ncbi-tools`. The `module spider` command will usually tell you about these dependencies.

</details>

On Sherlock, for example, Claude Code is available as a module:

```bash
module load claude-code
```

Otherwise, you can install it directly with a single command:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Run `claude` to launch it and follow the authentication prompts. Once set up, you can ask it to help with anything from "set up my conda environment" to "why is my CUDA job failing."

I highly recommend helping Claude get familiar with your new cluster by giving it links to the cluster's documentation. Claude Code has a memory file called `CLAUDE.md` that it reads at the start of every session. You can ask it to save useful cluster details there so it remembers them for future conversations:

```text
Hello Claude! You are currently being run on the <cluster-name-here> cluster. Please take a look at this documentation website <url-here> to get familiar with how the cluster is set up. Add a summary of what you find to your global CLAUDE.md on this system.
```

## Step 5: Install Miniconda

[Miniconda](https://docs.anaconda.com/miniconda/) is a lightweight installer for conda, the package and environment manager most commonly used in the ML and data science communities. It lets you create isolated Python environments for different projects, which is essential on shared clusters where you don't have root access. I also use alternatives such as [Mamba](https://mamba.readthedocs.io/) (a faster drop-in replacement) and [uv](https://github.com/astral-sh/uv) (a newer, Rust-based `pip` replacement), but I'd recommend using Miniconda to start since it's the most widely used and is generally what most users already have set up.

Here is a step by step guide for getting Miniconda set-up:

1. First, we need to download and run the installer on the cluster. The example below is for Linux x86_64, which is the most common cluster architecture. You can check yours by running `uname -m` on the cluster. If it's something other than `x86_64`, find the right installer at the [Miniconda downloads page](https://docs.anaconda.com/miniconda/#latest-miniconda-installer-links).

   ```bash
   wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
   chmod +x Miniconda3-latest-Linux-x86_64.sh
   ./Miniconda3-latest-Linux-x86_64.sh
   ```

2. The installer will show you a very long license agreement. Scroll through (hold Enter) and accept at the end with `y`.

3. You will see the following message:

   ```bash
   Miniconda3 will now be installed into this location:

   /sailhome/viggiano/miniconda3
     - Press ENTER to confirm the location
     - Press CTRL-C to abort the installation
     - Or specify a different location below

   [/sailhome/viggiano/miniconda3] >>> /scr-ssd/viggiano/miniconda3
   ```

4. When prompted "Do you wish to update your shell profile to automatically initialize conda?", select `yes`. This ensures conda is available every time you open a new terminal.

5. Miniconda is now installed. We can now remove the installer file:

   ```bash
   rm Miniconda3-latest-Linux-x86_64.sh
   ```

You can now create new environments via:

```bash
conda create -n env-name python=3.10
```

## Step 6: Manage storage

Most clusters give your home directory (`~`) a limited quota. For example, Sherlock limits `$HOME` to just **15 GB**. When you use packages like [HuggingFace Transformers](https://huggingface.co/docs/transformers/), [PyTorch](https://pytorch.org/), or [Weights & Biases](https://wandb.ai/), model weights and cache files are automatically downloaded to subdirectories of your home directory (e.g., `~/.cache/huggingface/`, `~/.cache/torch/`, `~/.cache/wandb/`), which can fill up your quota quickly.

Clusters typically offer multiple storage locations, and it's important to understand what your options are so you can place files accordingly.

On Sherlock, the main options are:

| Filesystem                     | Path                         | Speed | Quota                                                       |
| ------------------------------ | ---------------------------- | ----- | ----------------------------------------------------------- |
| **Home** (`$HOME`)             | `/home/users/$USER/`         | Fast  | 15 GB                                                       |
| **Group Home** (`$GROUP_HOME`) | `/home/groups/<PI>/`         | Fast  | 1 TB shared                                                 |
| **Scratch** (`$SCRATCH`)       | `/scratch/users/$USER/`      | Fast  | Large (auto-purges after 90 days if you don't use the file) |
| **Oak** (`$OAK`)               | `/oak/stanford/groups/<PI>/` | Slow  | Large                                                       |

Your cluster will have its own storage layout; check with your admin or docs. The key principle is the same: if you have limited storage, keep large, growing directories off of `$HOME`. Shared storage locations usually have a convention for how users organize their directories. Take a look at what others on your cluster have done (e.g., `ls $GROUP_HOME`) and create a directory for yourself following the same pattern. A common convention is to use your username (e.g., `mkdir $GROUP_HOME/$USER`).

### Set up Symlinks for Cache locations

A **symlink** (symbolic link) is a special file that acts as a pointer to another location on the filesystem. To any program reading or writing files, a symlink looks and behaves exactly like a normal directory; the difference is that the actual data lives elsewhere. This means you can keep `~/.cache` in your home directory as far as any tool is concerned, but the files are really stored on a larger filesystem:

Here are some common examples of folders I'd recommend setting up symlink locations for:

```bash
# ln -s <target-on-larger-storage> <path-in-home>
ln -s $GROUP_HOME/viggiano/.cache ~/.cache
ln -s $GROUP_HOME/viggiano/.local ~/.local
ln -s $GROUP_HOME/viggiano/.conda ~/.conda
ln -s $GROUP_HOME/viggiano/.cursor-server ~/.cursor-server
ln -s $GROUP_HOME/viggiano/.vscode-server ~/.vscode-server
```

You can verify the symlinks are set up correctly by running `ls -al ~`. You should see something like this:

```bash
$ ls -al ~
lrwxrwxrwx  1 viggiano viggiano   35 Mar 29 12:00 .cache -> /home/groups/mylab/viggiano/.cache
lrwxrwxrwx  1 viggiano viggiano   35 Mar 29 12:00 .local -> /home/groups/mylab/viggiano/.local
lrwxrwxrwx  1 viggiano viggiano   35 Mar 29 12:00 .conda -> /home/groups/mylab/viggiano/.conda
lrwxrwxrwx  1 viggiano viggiano   42 Mar 29 12:00 .cursor-server -> /home/groups/mylab/viggiano/.cursor-server
lrwxrwxrwx  1 viggiano viggiano   42 Mar 29 12:00 .vscode-server -> /home/groups/mylab/viggiano/.vscode-server
```

The `->` arrow tells you each directory is a symlink pointing to its target on the larger filesystem.

### Redirect where conda environments are saved

Conda environments can also get pretty big quickly. You can tell conda to store them on a larger filesystem by default:

```bash
conda config --prepend envs_dirs /home/groups/<PI>/viggiano/envs
```

Now `conda create -n my-env python=3.10` will create the environment on the larger filesystem, and `conda activate my-env` still works by name from anywhere.

<details markdown="1">
<summary>Other useful conda config commands</summary>

- Show all configured environment directories:
  - `conda config --show envs_dirs`
- Add a directory to the _end_ of the list (lowest priority):
  - `conda config --append envs_dirs /path/to/your/new/envs/location`
- Remove a specific directory from the list:
  - `conda config --remove envs_dirs /path/to/remove`

</details>

## Step 7: Customize shell functionality

One of the most powerful things I have started doing is writing custom shell functions that automate repetitive tasks. Your `~/.bashrc` (or `~/.zshrc`) runs every time you open a new shell session, making it the perfect place to add aliases, helper functions, and environment variables that make your life easier on the cluster. Here are a few I've found really useful.

### `.bashrc` functions

#### `create_workspace_file` - Generate a VS Code/Cursor workspace file for the current directory

Setting up workspace files for VS Code/Cursor by hand is tedious. This function generates a `.code-workspace` file for your current directory and saves it to `~/workspaces`. You can then open it directly from the terminal with `cursor ~/workspaces/my-project.code-workspace`.

```bash
create_workspace_file() {
    local current_dir=$(basename "$PWD")
    local current_path="$PWD"
    local target_dir="$HOME/workspaces"
    mkdir -p "$target_dir"
    local workspace_file="$target_dir/$current_dir.code-workspace"
    cat > "$workspace_file" <<EOL
{
    "folders": [
        {
            "path": "$current_path"
        }
    ],
    "settings": {}
}
EOL
    echo "Workspace file created at: $workspace_file"
}
```

#### `gpu-users` - See who is using which GPUs

On clusters that don't use SLURM for GPU allocation (where users share GPUs directly), it can be helpful to see which users are running processes on which GPUs before you launch a job. This function displays which users currently have processes using the various visible GPUs.

```bash
gpu-users() {
    echo -e "GPU\tPID\tUSER\tPROCESS"
    nvidia-smi --query-compute-apps=gpu_uuid,pid,process_name --format=csv,noheader,nounits |
    while IFS=',' read -r gpu_uuid pid pname; do
        pid=$(echo "$pid" | tr -d '[:space:]')
        [ -z "$pid" ] && continue
        if [[ "$pid" =~ ^[0-9]+$ ]]; then
            user=$(ps -o user= -p "$pid" 2>/dev/null)
            if [ -n "$user" ]; then
                gpu_id=$(nvidia-smi --query-gpu=gpu_uuid,index --format=csv,noheader | grep "$gpu_uuid" | awk -F',' '{print $2}' | xargs)
                echo -e "$gpu_id\t$pid\t$user\t$pname"
            fi
        fi
    done | sort -k1,1n
}
```

### tmux

[tmux](https://github.com/tmux/tmux) is a terminal multiplexer that lets you run persistent sessions on the cluster. If your SSH connection drops, your tmux session keeps running and you can reattach to it. I'd recommend adding the following to `~/.tmux.conf` to enable mouse scrolling and selection:

```bash
# Enable mouse support (allows clicking and dragging to select)
set -g mouse on
```

<details markdown="1">
<summary>Basic tmux commands</summary>

| Command                    | Description                                         |
| -------------------------- | --------------------------------------------------- |
| `tmux new -s mysession`    | Create a new named session                          |
| `tmux attach -t mysession` | Reattach to an existing session                     |
| `tmux ls`                  | List all active sessions                            |
| `Ctrl+b d`                 | Detach from current session (session keeps running) |
| `Ctrl+b c`                 | Create a new window within a session                |
| `Ctrl+b n` / `Ctrl+b p`    | Switch to next / previous window                    |
| `Ctrl+b %`                 | Split pane vertically                               |
| `Ctrl+b "`                 | Split pane horizontally                             |
| `Ctrl+b arrow keys`        | Switch between panes                                |
| `exit`                     | Close the current pane or window                    |

A typical workflow: start a tmux session, kick off a long-running training job, detach with `Ctrl+b d`, close your laptop, and reattach later with `tmux attach -t mysession` to check on progress.

</details>

### Launch scripts (Advanced)

Once you're comfortable with tmux, a natural next step is writing small launch scripts that combine tmux with resource allocation. On clusters that use SLURM, I'll often write a script that requests GPU resources and drops me into a tmux session in one command. Here's an example:

<details markdown="1">
<summary>Example: GPU launch script</summary>

```bash
#!/usr/bin/env bash
# Usage: launch_gpu [NUM_GPUS] [PARTITION]
# Example: launch_gpu 2 gpu

NUM_GPUS="${1:-1}"
PARTITION="${2:-gpu}"

# Auto-name sessions: gpu_session_1, gpu_session_2, etc.
SESSION_COUNT=$(tmux list-sessions 2>/dev/null | wc -l)
SESSION_NAME="gpu_session_$((SESSION_COUNT + 1))"

# Create a tmux session and request an interactive SLURM job inside it
tmux new-session -d -s "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "srun --partition=$PARTITION --gpus=$NUM_GPUS --cpus-per-task=8 --mem=32G --time=8:00:00 --pty bash" C-m

echo "Launched session: $SESSION_NAME"
tmux attach -t "$SESSION_NAME"
```

</details>

This script auto-names each session, requests an interactive GPU job via SLURM, and attaches you to the tmux session. Adjust the partition name, memory, CPU, and time limits to match your cluster. Save it somewhere on your PATH (e.g., `~/.local/bin/launch_gpu`) and make it executable with `chmod +x`.

<small>**Heads up:** The resource values above (GPUs, CPUs, memory, time) are just defaults. Before running something like this, talk to your advisor or ask Claude Code about what resources are appropriate for your specific workflow and cluster. Requesting too much wastes shared resources; requesting too little and your job will fail or run slowly.</small>

## Step 8: Git and GitHub setup

You'll almost certainly want to push and pull code on the cluster. This requires authenticating with GitHub from the cluster, which is a separate step from the SSH key setup in Step 3 (that was for connecting _to_ the cluster; this is for connecting _from_ the cluster to GitHub).

### Install the GitHub CLI

The [GitHub CLI](https://cli.github.com/) (`gh`) is one of my favorite tools. It lets you interact with GitHub entirely from the terminal: create PRs, browse repos, review issues, manage workflows, and more. Most importantly for our purposes, it handles git authentication seamlessly so you never have to manually deal with tokens or credentials when pushing and pulling.

The easiest way to install is with `brew install gh`, but you usually don't have permission to use `brew` on a cluster. I'd recommend downloading the binary directly and placing it on your PATH. This way `gh` is always available regardless of which conda environment is active:

```bash
# Check https://github.com/cli/cli/releases for the latest version
wget https://github.com/cli/cli/releases/download/v2.89.0/gh_2.89.0_linux_amd64.tar.gz
tar xzf gh_*.tar.gz

# Move the binary somewhere on your PATH
mkdir -p ~/.local/bin
cp gh_*/bin/gh ~/.local/bin/

# Clean up
rm -rf gh_*
```

Make sure `~/.local/bin` is on your PATH by adding this to your `~/.bashrc` if it isn't already:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

<details markdown="1">
<summary>Alternative: install via conda</summary>

You can also install `gh` through conda, but note that it will only be available when that specific environment is active:

```bash
conda activate base
conda install gh --channel conda-forge
```

</details>

### Authenticate with GitHub

The `gh` CLI can handle authentication for you. Run:

```bash
gh auth login
```

Select HTTPS when prompted, then choose "Paste an authentication token" and generate a new token at [github.com/settings/tokens](https://github.com/settings/tokens). Once authenticated, run:

```bash
gh auth setup-git
```

This configures git to use `gh` as a credential helper, so you won't be asked for credentials when pushing or pulling.

<details markdown="1">
<summary>Alternative: SSH authentication with GitHub</summary>

The HTTPS approach above is all you need, but if you prefer using `git@github.com:...` SSH URLs instead, you can add your SSH key to GitHub. Generate one on the cluster if you don't have one already:

```bash
ssh-keygen -t ed25519 -C "viggiano@stanford.edu"
```

Copy your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Then add it at [github.com/settings/keys](https://github.com/settings/keys) by clicking "New SSH Key" and pasting the contents. Test the connection:

```bash
ssh -T git@github.com
```

</details>

### Configure git

Set your identity and preferences. Here are some I like to set:

```bash
git config --global user.email "viggiano@stanford.edu"
git config --global user.name "Ben Viggiano"
git config --global init.defaultBranch main
git config --global core.editor "vim"
```

### Set up a global .gitignore

A global gitignore lets you exclude files across all repos without adding them to each project's `.gitignore`. Create the file:

```bash
vim ~/.gitignore_global
```

Example `~/.gitignore_global`:

```
dev_notebook.ipynb
```

Then tell git to use it:

```bash
git config --global core.excludesfile '~/.gitignore_global'
```

## Step 9: Authenticate with ML services

If you're doing ML work, you'll likely need to authenticate with a few external services to download models or track experiments.

### HuggingFace

[HuggingFace](https://huggingface.co/) is the largest open-source hub for ML models, datasets, and tools. Many popular models (like [Llama](https://huggingface.co/meta-llama), [Mistral](https://huggingface.co/mistralai), and [Gemma](https://huggingface.co/google)) are "gated," meaning you need to create a HuggingFace account and accept the model's license on its page before you can download it. Once you've done that, you'll need to authenticate on the cluster.

Install the HuggingFace CLI and log in:

```bash
curl -LsSf https://hf.co/cli/install.sh | bash
hf auth login
```

Alternatively, you can set the token directly in your environment (useful for non-interactive scripts):

```bash
export HF_TOKEN=hf_...
```

You can generate a token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Verify it worked:

```bash
huggingface-cli whoami
```

### Weights & Biases

[Weights & Biases](https://wandb.ai/) (W&B) is a popular platform for tracking ML experiments. It logs your training metrics, hyperparameters, and outputs to a web dashboard, making it easy to compare runs and share results with collaborators. Install and log in:

```bash
pip install wandb
wandb login
```

You'll be prompted for your API key, which you can find at [wandb.ai/authorize](https://wandb.ai/authorize).

## Summary

That's it! Thanks for reading. If you have suggestions for improving this guide, please [open an issue](https://github.com/bviggiano/bviggiano.github.io/issues/new)!

Thanks to [Jake Silberg](https://jsilbergds.github.io/) for reviewing an early version of this post and giving feedback.

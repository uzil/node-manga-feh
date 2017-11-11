manga-feh - download manga scans from mangareader.net or other manga websites

# REQUIREMENTS
- Node >= 6
- npm >= 2


# INSTALLATION
In your shell
```shell
npm install -g manga-feh
```

or 

```shell
git clone https://github.com/uzil/node-manga-feh
cd node-manga-feh
npm link
```

# DESCRIPTION
**manga-feh** is a command-line program to download manga chapter scans from mangageader.net and a few more sites. It Node.js , and it is not platform specific. It should work on your Unix box, on Windows or on Mac OS X.

    manga-feh [OPTIONS] URL [path]

# OPTIONS
    -h, --help                       Print this help text and exit
    --version                        Print program version 

#### SUPPORTS
- Mangareader (as of now)

# URL TEMPLATE
URL supports simple templates
`http://www.mangareader.net/one-piece/{880-884}`
Will download all the scans from chapter 880 to 884

`http://www.mangareader.net/one-piece/880`
Will only download scans from chapter 880 


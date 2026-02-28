// to install go to: https://stopsopa.github.io//pages/bash/index.html#xx

// https://stopsopa.github.io/viewer.html?file=%2Fpages%2Fbash%2Fxx%2Fxx-template.cjs
// edit: https://github.com/stopsopa/stopsopa.github.io/blob/master/pages/bash/xx/xx-template.cjs

// 🚀 -
// ✅ -
// ⚙️  -
// 🗑️  -
// 🛑 -
// to call other xx commands from inside any xx command use:
//    shopt -s expand_aliases && source ~/.bashrc
// after that just do:
//   xx <command_name>

module.exports = (setup) => {
  return {
    help: {
      command: `
set -e  
# git config core.excludesFile .git/.gitignore_local

# echo -e "\n      Press enter to continue\n"
# read

# source .env
# source .env.sh
export NODE_OPTIONS=""
        
cat <<EEE

  🐙 GitHub: $(git ls-remote --get-url origin | awk '{\$1=\$1};1' | tr -d '\\n' | sed -E 's/git@github\\.com:([^/]+)\\/(.+)\\.git/https:\\/\\/github.com\\/\\1\\/\\2/g')

  arango admin:
    http://localhost:\${DYNAMO_ADMIN_PORT}

-- DEV NOTES --

EEE

      `,
      description: "Status of all things",
      source: false,
      confirm: false,
    },

    [`coverage server`]: {
      command: `
PORT="4286"
cat <<EEE
    http://localhost:\${PORT}
EEE

echo -e "\n      Press enter to continue\n"
read

TARGET="./docs"

# detect python version and run one or another version
cd "\${TARGET}"
if python3 -c "import http.server" > /dev/null 2>&1; then
    echo -e "\nrunning: python3 -m http.server \${PORT}\n"
    python3 -m http.server \${PORT}
elif python -c "import http.server" > /dev/null 2>&1; then
    echo -e "\nrunning: python -m http.server \${PORT}\n"
    python -m http.server \${PORT}
elif python -c "import SimpleHTTPServer" > /dev/null 2>&1; then
    echo -e "\nrunning: python -m SimpleHTTPServer \${PORT}\n"
    python -m SimpleHTTPServer \${PORT}
else
    echo -e "\nPython http server module not found\n"
    exit 1
fi
`,
      confirm: false,
    },

    ...setup,
  };
};

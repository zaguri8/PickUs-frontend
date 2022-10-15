const { exec } = require('child_process');
const { exit } = require('process');
const spawn = () => { setTimeout(() => { exit(0) }, 30 * 1000) }

(function uploadToGit(commit_note) {
    const upload_command = `npm run deploy && git add . && git commit -m '${commit_note}' && git push --force`
    exec(upload_command)
        .on('spawn', spawn)
        .on('message', console.log)
        .on('error', console.log)
})(process.argv[2] /* command execution argument - commit message */)
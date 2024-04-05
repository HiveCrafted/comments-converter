const fs = require('fs');
const readline = require('readline');

async function formatCommentsToJson(inputFilePath, outputFilePath) {
    const fileStream = fs.createReadStream(inputFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let comments = [];
    let comment = {};
    let isCommentBlock = false;

    for await (const line of rl) {
        if (line.startsWith('Video URL:')) {
            comment.video_url = line.split(' ')[2];
        } else if (line.startsWith('Title:')) {
            comment.title = line.substring(7);
        } else if (line.startsWith('Total:')) {
            comment.total_comments = parseInt(line.split(' ')[1]);
        } else if (line.startsWith('#####')) {
            if (isCommentBlock) {
                comments.push(comment);
                comment = {};
            }
            isCommentBlock = !isCommentBlock;
        } else if (isCommentBlock) {
            if (line.includes('youtube.com/channel/')) {
                const parts = line.split('\n');
                comment.username = parts[0];
                comment.channel_url = parts[1];
            } else if (line.startsWith('date:')) {
                comment.date = line.split(' ')[1];
            } else if (line.trim() !== '') {
                comment.comment = line;
            }
        }
    }

    const output = {
        event_info: {
            title: comments[0].title,
            video_url: comments[0].video_url,
            total_comments: comments[0].total_comments,
        },
        comments: comments.map(c => ({
            username: c.username,
            channel_url: c.channel_url,
            date: c.date,
            comment: c.comment
        }))
    };

    fs.writeFileSync(outputFilePath, JSON.stringify(output, null, 2));
}

// Usage
formatCommentsToJson('input/input.txt', 'output/output.json');

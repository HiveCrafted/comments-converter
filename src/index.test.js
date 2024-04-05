// FILEPATH: /Users/jurowski/h/comments-converter/test/index.test.js
const fs = require('fs');
// const formatCommentsToJson = require('index');
const formatCommentsToJson = require('./index');

jest.mock('fs');

describe('formatCommentsToJson', () => {
    beforeEach(() => {
        // Reset the fs mocks before each test
        fs.createReadStream.mockReset();
        fs.writeFileSync.mockReset();
    });

    it('reads from the correct input file', async () => {
        await formatCommentsToJson('input.txt', 'output.json');
        expect(fs.createReadStream).toHaveBeenCalledWith('input.txt');
    });

    it('writes to the correct output file', async () => {
        await formatCommentsToJson('input.txt', 'output.json');
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(String));
    });

    it('formats comments correctly', async () => {
        // Mock the input file stream
        const mockStream = {
            on: (event, callback) => {
                if (event === 'data') {
                    callback('Video URL: url\nTitle: title\nTotal: 1\n#####\nusername\nyoutube.com/channel/url\ndate: date\ncomment\n#####');
                }
                if (event === 'end') {
                    callback();
                }
            }
        };
        fs.createReadStream.mockReturnValue(mockStream);

        await formatCommentsToJson('input.txt', 'output.json');

        const expectedOutput = JSON.stringify({
            event_info: {
                title: 'title',
                video_url: 'url',
                total_comments: 1,
            },
            comments: [{
                username: 'username',
                channel_url: 'youtube.com/channel/url',
                date: 'date',
                comment: 'comment'
            }]
        }, null, 2);

        expect(fs.writeFileSync).toHaveBeenCalledWith('output.json', expectedOutput);
    });
});
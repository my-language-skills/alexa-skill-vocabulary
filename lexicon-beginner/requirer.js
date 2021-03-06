/**
 * This script is responsible to include all necessary custom content files
 * used by the skill
 */


/**
 * This function takes parameter the level of education of the user and returns
 * the necessary node.js content files.
 *
 * @param {string} level the request level for content files. level of vocabulary to return
 */
const content = function(level = 'a1')
{
    switch(level.toUpperCase())
    {
        case "A1":
            {
                return  require('./content_files/content_lexicon_begginer') ? require('./content_files/content_lexicon_begginer').CONTENT : false;

            }
        default:
            return false;
    }
};
module.exports.content = content;

/**
 * This function returns the node.js that contains all the messages strings
 * translated in all available languages.
 */
const lang_strings = function()
{
   return require('./content_files/language_strings') ? require('./content_files/language_strings').CONTENT : false;
};
module.exports.content_language_strings = lang_strings;

/**
 * This function returns the node.js that contains the intent's keywords strings
 * translated in all available languages.
 */
const editor_options = function()
{
    return require('./content_files/editor_options') ? require('./content_files/editor_options').CONTENT : false;
}
module.exports.editor_options = editor_options;

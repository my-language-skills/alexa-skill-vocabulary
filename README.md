# alexa-skill-vocabulary
* Conrtibutors: @CharalamposTheodorou
* Tags: alexa, skill, amazon
* Current version: 1.1

## Description:
- Amazon Alexa skill for learning Vocabulary.
- Vocabulary is provided in 5 languages. (English/Spanish/German/French/Italian).
- Still in development stage.

## Usage
- Skill is used by setting up a Native and a Learning Language.
- Native language has default value of alexa speaking language.
- A request can be made to change either of them in any stage of the application.
- When both languages are setup, the user can access a list of categories and subcategories of vocabulary words with examples.
- Random option is provided throghout the application.


## Special Request
All requests can be given in both native or learning language except when:
- It's a request for changing any of both languages (**MUST** be given in Native Language)
- No learning language is selected (**MUST** be defined)


## Versions
 * 1.1:
    * Changes:
        - New language editor temp file, updated way to handle intentions (with option for dynamic usage of categories or subcategories available)
        - In index file, updated way to handle the intents and requirement files (to not load everything every time, a part of the file so that the process is not overwhelmed)

 * 1.0:
    * Json Editors for Alexa:
        - 5 language editor files.
        - Each one for different language.
        - Each one contain all information for all other languages (to give the option to change language mid-operation of the skill).
        - All content information exists in all files. (categories/subcategories/translations)
    * Content Files:
        - 1 content file for vocabulary  A1 level (currently)
        - 1 editor_options file for checking all possible user keywords with all translations available.
        - 1 language strings file that contains all Alexa response messages in all languages available.
    * Skill Operation files:
        - 1 main file of operation: index.js. This file handles all Intents of the skill.
        - 1 external file that is responsible to require all necessary external content files (Mutation in futuer versions to load specific content files).

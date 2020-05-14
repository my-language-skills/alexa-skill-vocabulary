/* Core Libraries for Skill */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

/* Custom Constants for volume and speed */
const volume_levels = ['silent','x-soft','soft','medium','loud','x-loud']; //used to adjuste the sound volume
const rate_levels = ['40%','50%','60%','75%','90%','100%','120%','150%','200%']; // used to adjust the speech speed

//includes the file that loads any custom content file.
const skill_files = require('./requirer');

/**
 * Setup for const value for content files..
 *
 * languageString will only have text responses..
 * everything that needs info or more instructions will be in a content file.
 *
 * languageString will be used only for the initial startup of the skill (default language).
 */
const languageString = {
    'en-US':{
        translation: {
            INITIAL_LANGUAGE: "english",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "english",
            NATIVE_VOICE: "Kendra",
            SKILL_NAME: 'Lexicon beginner',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            },
    },
    'es-ES':{
        translation: {
            INITIAL_LANGUAGE: "español",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "spanish",
            NATIVE_VOICE: "Lucia",
            SKILL_NAME: 'Lexicon principiante',
            WELCOME: 'Bienvenido a %s. Te voy a enseñar vocabulario en diferentes idiomas. El idioma nativo está configurado en %s. ',
            },
    },
    'it-IT':{
        translation: {
            INITIAL_LANGUAGE: "italiano",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "italian",
            NATIVE_VOICE: "Carla",
            SKILL_NAME: 'Lexicon principiante',
            WELCOME: 'Benvenuto in %s. Ti insegnerò il vocabolario in diverse lingue. La lingua nativa è impostata su %s.',
            },
    },
    'fr-FR':{
        translation: {
            INITIAL_LANGUAGE: "Français",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "french",
            NATIVE_VOICE: "Celine",
            SKILL_NAME: 'Lexicon novice',
            WELCOME: 'Bienvenue en %s. Je vais vous enseigner le vocabulaire dans différentes langues. La langue maternelle est définie sur le %s.',
            },
    },
    'de-DE':{
        translation: {
            INITIAL_LANGUAGE: "Deutsche",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "german",
            NATIVE_VOICE: "Marlene",
            SKILL_NAME: 'Lexicon neuling',
            WELCOME: 'Willkommen bei %s. Ich werde Ihnen Vokabeln in verschiedenen Sprachen beibringen. Die Muttersprache ist auf %s eingestellt',
            },
    },
  };

// INTENTS

/**
 * Internal Alexa skill intent that triggers when an error occurs during runtime
 */
const FallbackHandler = {

    // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.

    //              This handler will not be triggered except in that locale, so it can be

    //              safely deployed for any locale.

    canHandle(handlerInput) {

      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return handlerInput.responseBuilder
        .speak(retrieve_Strings("general",sessionAttributes.native_language,"fallback"))
        .getResponse();
    },
};

/**
 * Responsible to setup the locale of the skill's initial speaking language
 */
let LocalizationInterceptor = {
    process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
        lng: handlerInput.requestEnvelope.request.locale,
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        resources: languageString,
        returnObjects: true
      });

      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function (...args) {
        return localizationClient.t(...args);
      };
    },
};

/**
 * Handles real-time application errors and shows the results to the user.
 */
const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);

      return handlerInput.responseBuilder
        .speak("Run-Time Error: "+error.message)
        .getResponse();
    },
};

/**
 * Intent that is triggered when the user cancels/ends session
 */
const SessionEndedRequest = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        const output = `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`;
      console.log(output);

      return handlerInput.responseBuilder
        .speak(output)
        .withShouldEndSession(true)
        .getResponse();
    },
};

/**
 * Intent is triggered when user chooses to cancel and stop the operation of the skill
 */
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        return handlerInput.responseBuilder
            .withShouldEndSession(true)
            .speak(retrieve_Strings("warnings",sessionAttributes.native_language,"cancel_stop"))
            .getResponse();
    },
};

/** CUSTOM INTENTS */

/**
 * Custom Intent to show help/options for each specific location in the process.
 * And according to user input.
 */
const HelpIntent = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.HelpIntent' || request.intent.name === 'HelpIntent');
    },
    handle(handlerInput) {

        let helpmsg;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        //option requested by the user
        let options = slots['help_options'].value;

        //check if keyword for options slot given in native or learning language
        if (options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.native_language,"help").toUpperCase()
            || options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.learning_language,"help").toUpperCase())
        { //to show help messages.
            if (sessionAttributes.helpmsg == "Launch")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"launch");
            }
            else if (sessionAttributes.helpmsg == "ShowCategories" || sessionAttributes.helpmsg=="UserSelectionCategory")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"show_categories");
            }
            else if (sessionAttributes.helpmsg == "UserSelectionSubcategory" || sessionAttributes.helpmsg == "UserSelection" )
            {
                if (sessionAttributes.subcategory != undefined)
                    helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"select_categories" );
                else
                    helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"show_categories");
            }
            else if (sessionAttributes.helpmsg == "ExampleIntent")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"example");
            }
            else if (sessionAttributes.helpmsg == "DetailsIntent")
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"details")+retrieve_Strings("help",sessionAttributes.native_language,"example");
            else if (sessionAttributes.helpmsg == "IndexIntent")
                if (sessionAttributes.learning_language == "none")
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"lauch");
                else
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"show_categories");
            else if (sessionAttributes.helpmsg == "LanguageSelection")
            {//check if selected a category or a subcategory.. or an example, give option to continue where left off
                if (sessionAttributes.reset == false)
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"resume");
                else
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"reset");
            }
            helpmsg+= retrieve_Strings("general",sessionAttributes.native_language,"options");
        }
        else if (options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.native_language,"options").toUpperCase() || options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.learning_language,"options").toUpperCase() || options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.native_language,"instructions").toUpperCase() || options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.learning_language,"instructions").toUpperCase())
        {//to give instructions...
            if (sessionAttributes.helpmsg == "Launch")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"welcome");
            }
            else if (sessionAttributes.helpmsg == "ShowCategories" || sessionAttributes.helpmsg=="UserSelectionCategory")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"show_categories");
            }
            else if (sessionAttributes.helpmsg == "UserSelectionSubcategory" || sessionAttributes.helpmsg == "UserSelection" )
            {
                if (sessionAttributes.subcategory != undefined)
                    helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"select_categories");
                else
                    helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"show_categories");
            }
            else if (sessionAttributes.helpmsg == "ExampleIntent")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"example")+retrieve_Strings("options",sessionAttributes.native_language,"details");
            }
            else if (sessionAttributes.helpmsg == "DetailsIntent")
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"details")+retrieve_Strings("options",sessionAttributes.native_language,"example");
            else if (sessionAttributes.helpmsg == "IndexIntent")
                if (sessionAttributes.learning_language == "none")
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"welcome");
                else if (sessionAttributes.subcategory != undefined)
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"index");
                else
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"show_categories");
            else if (sessionAttributes.helpmsg == "LanguageSelection")
            {
                if (sessionAttributes.reset == false)
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"resume");
                else
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"reset");
            }
        }
        else
            helpmsg = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
        Object.assign(sessionAttributes,
        {
            lastmsg: helpmsg,
            break: 0,
            voice: retrieve_Strings("voices",sessionAttributes.native_language,false),
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //setting the return help/options message in correct voice attributes
        helpmsg = switchVoice(helpmsg,handlerInput.attributesManager.getSessionAttributes());
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(helpmsg)
            .getResponse();
    },
};

/**
 * Custom Intent to repeat last message given to the user.
 * Checks user preference in speed and volume before repeating..
 * User can select to hear it faster/slower or louder/quieter.
 */
const RepeatMessageIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'RepeatMessageIntent';
    },
    handle(handlerInput)
    {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const speed = slots['speed'].value;
        const volume = slots['volume'].value;
        const repeat = slots['Repeat'].value;

        let repeat_rate = sessionAttributes.rate;
        let repeat_volume = sessionAttributes.volume;
        let output = sessionAttributes.lastmsg != undefined ? sessionAttributes.lastmsg : retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");

        if (speed!= undefined)
        {
            if (speed.toUpperCase() == checkEditor("speed_list",sessionAttributes.native_language,"faster").toUpperCase() || speed.toUpperCase() == checkEditor("speed_list",sessionAttributes.learning_language,"faster").toUpperCase())
            {//faster
                for (let i =0;i<rate_levels.length;i++)
                    if (sessionAttributes.rate == rate_levels[i])
                        if (i==rate_levels.length-1)
                            repeat_rate = rate_levels[i];
                        else
                            repeat_rate = rate_levels[i+1];
            }
            else if (speed.toUpperCase() == checkEditor("speed_list",sessionAttributes.native_language,"slower").toUpperCase() || speed.toUpperCase() == checkEditor("speed_list",sessionAttributes.learning_language,"slower").toUpperCase())
            {//slower
                for (let i =0;i<rate_levels.length;i++)
                if (sessionAttributes.rate == rate_levels[i])
                    if (i==0)
                        repeat_rate = rate_levels[0];
                    else
                        repeat_rate = rate_levels[i-1];
            }
            else
                output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request")+". But sure..:"+output;

        }
        else if (volume != undefined)
        {
            if (volume.toUpperCase() == checkEditor("volume_list",sessionAttributes.native_language,"louder").toUpperCase() || volume.toUpperCase() == checkEditor("volume_list",sessionAttributes.learning_language,"louder").toUpperCase())
            {//louder
                for (let i=0;i<volume_levels.length;i++)
                {
                    if (sessionAttributes.volume == volume_levels[i])
                        if (i==volume_levels.length-1)
                            repeat_volume = volume_levels[i];
                        else
                            repeat_volume = volume_levels[i+1];
                }
            }
            else if (volume.toUpperCase() == checkEditor("volume_list",sessionAttributes.native_language,"quieter").toUpperCase() || volume.toUpperCase() == checkEditor("volume_list",sessionAttributes.learning_language,"quieter").toUpperCase())
            {//quieter
                for (let i=0;i<volume_levels.length;i++)
                {
                    if (sessionAttributes.volume == volume_levels[i])
                        if (i==0)
                            repeat_volume = volume_levels[0];
                        else
                            repeat_volume = volume_levels[i-1];
                }
            }
            else
                output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
        }
        else if (repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.native_language,"repeat").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.learning_language,"repeat").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.native_language,"again").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.learning_language,"again").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.native_language,"repeat again").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.learning_language,"repeat again").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.native_language,"repeat normal").toUpperCase()
        || repeat.toUpperCase() == checkEditor("repeat_list",sessionAttributes.learning_language,"repeat normal").toUpperCase())
        {
            repeat_rate = "100%";
            repeat_volume = "medium";
        }
        else
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");

        Object.assign(sessionAttributes,
            {
                break:1,
                rate:repeat_rate,
                volume: repeat_volume,
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        //setting up the return message with appropriate voice attributes.
        output = switchVoice(output,handlerInput.attributesManager.getSessionAttributes());
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};

/**
 * Starting point of application
 * Intent to Launch Skill.
 * Shows initial welcoming messages, in the default language of alexa and sets
 * the speaking language (native) to the default
 */
const LaunchRequest = {
    canHandle(handlerInput)
    {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'LaunchRequest'
        || (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StartOverIntent');
    },
    handle(handlerInput)
    {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let output = requestAttributes.t("WELCOME",requestAttributes.t("SKILL_NAME"),requestAttributes.t("INITIAL_LANGUAGE"))+retrieve_Strings("help",requestAttributes.t("INITIAL_LANGUAGE_ENGLISH"),"launch");
        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "Launch",
                voice: requestAttributes.t("NATIVE_VOICE"),
                learning_language: "none",
                native_language: requestAttributes.t("INITIAL_LANGUAGE_ENGLISH"),
                native_name: requestAttributes.t("INITIAL_LANGUAGE"),
                learning_name: "none",
                break: 0,
                rate: "100%",
                volume: "medium",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        //setting up the return message of Alexa with appropriate voice attributes.
        output = switchVoice(output,handlerInput.attributesManager.getSessionAttributes());

        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};

/**
 * Custom Intent to change Native or Learning language
 */
const LanguageSelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'LanguageSelectionIntent';
    },
    handle(handlerInput)
    {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const language = slots['language'].value;
        const type = slots['language_type'].value;
        let output = "";
        let native=sessionAttributes.native_language;
        let learning= sessionAttributes.learning_language;
        let native_name=sessionAttributes.native_name
        let learning_name=sessionAttributes.learning_name;
        let reset = false;
        let category = sessionAttributes.category;
        let subcategory = sessionAttributes.subcategory;

        let language_request_english = returnSpokenLanguage(language); //language that the request was given. (in english)

        if (language_request_english == "unidentified" || language_request_english == "undefined"
            || language_request_english.toUpperCase() != native.toUpperCase())
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request")+retrieve_Strings("warnings",sessionAttributes.native_language,"given_request")+retrieve_Strings("translation",sessionAttributes.native_language,language_request_english)+". ";
        }
        else
        {
            if (language != undefined && type !=undefined)
            {//request to change native or learning language
                if (type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"native").toUpperCase()
                || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"native").toUpperCase()
                || type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"mother").toUpperCase()
                || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"mother").toUpperCase())
                {//request to change the native language
                    if (native.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"native_warn")+language+". ";
                    else if (learning.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = language+retrieve_Strings("warnings",sessionAttributes.native_language,"same_selection");
                    else
                    {//validation for changing native language is approved
                        output = retrieve_Strings("warnings",language,"native_selection")+language+". ";
                        native_name = language;
                        native = retrieve_Strings("translation",language,"return");
                        reset = true;
                    }
                }
                else if  (type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"teaching").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"teaching").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"second").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"second").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"learning").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"learning").toUpperCase())
                {//request to change learning language

                    if (learning.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"learning_warn")+language+". ";//same selection as before
                    else if (native.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = language+retrieve_Strings("warnings",sessionAttributes.native_language,"same_selection"); //both languages are the same
                    else
                    {//validation for changing learning language is approved
                        output = retrieve_Strings("language",native,"selection")+retrieve_Strings("warnings",sessionAttributes.native_language,"learning_selection")+language+". ";
                        learning_name = language;
                        learning = retrieve_Strings("translation",language,"return");
                        reset = true;
                    }
                }
                else
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
            }
            else if (type == undefined && language!= undefined)
            {//learn "language", set learning language to this
                // check if learning language is the same as before..
                if (learning.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"learning_warn")+language+". ";
                else if (native.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                    output = language+retrieve_Strings("warnings",sessionAttributes.native_language,"same_selection"); //if same selection for both languages
                else
                {//updating learning language
                    output =  retrieve_Strings("language",native,"selection")+retrieve_Strings("warnings",sessionAttributes.native_language,"learning_selection")+language+". ";
                    learning_name = language;
                    learning = retrieve_Strings("translation",language,"return");
                    reset = true;
                }
                //changes learning language only.
            }
            else//something wasn't given correctly
                output= retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");
        }

        //updating the session Attributes
        Object.assign(sessionAttributes,
            {
                native_language: native,
                learning_language: learning,
                native_name: native_name,
                learning_name: learning_name,
                lastmsg: output,
                helpmsg: "LanguageSelection",
                voice: retrieve_Strings("voices",native),
                break: 0,
                rate: "100%",
                volume: "medium",
                reset: reset,
                category: category,
                subcategory: subcategory,
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //if learning language change then all categories are changed.. (different info)
        // so must reset all category and subcategory selections and reset the examples.
        if (reset == true)
        {
            Object.assign(sessionAttributes,
            {
                category: undefined,
                subcategory: undefined,
            });
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            output+= retrieve_Strings("warnings",sessionAttributes.native_language,"reset");
        }
        //setting appropriate voice for the return message.
        output = switchVoice(output/* +retrieve_Strings("language",native,"selection")+sessionAttributes.learning_name */,sessionAttributes);
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    }
};

/**
 * Custom Intent to show currrent category, subcategory, example, native and learning languages.
 */
const IndexIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'IndexIntent';
    },
    handle(handlerInput)
    {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        const request = slots['request'].value;
        let output ="";
        if (sessionAttributes.category != undefined &&
            (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_category").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_category").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_theme").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_theme").toUpperCase()))
        {//current category
            output = request+" . "+sessionAttributes.category;
        }
        else if (sessionAttributes.subcategory != undefined &&
            (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_subcategory").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_subcategory").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_topic").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_topic").toUpperCase()))
        {//current subcategory
            output = request+" . "+sessionAttributes.subcategory;
        }
        else if (sessionAttributes.examples_ids != undefined && sessionAttributes.category != undefined && sessionAttributes.subcategory != undefined &&
            (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_example").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_example").toUpperCase()))
        {//current example
            if (sessionAttributes.examples_ids.length>0)
                output = request+" .  "+sessionAttributes.native_word;
            else
                output = retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");
        }
        else if (sessionAttributes.learning_language != undefined &&
            (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"learning_language").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"learning_language").toUpperCase()))
        {//current learning language
            output = request + " .  "+sessionAttributes.learning_name;
        }
        else if (sessionAttributes.native_language != undefined &&
            (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"native_language").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"native_language").toUpperCase()
            ||request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"mother_language").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"mother_language").toUpperCase()))
        {//current native language
            output = request + " .  "+sessionAttributes.native_name;
        }
        else if (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"language_list").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"language_list").toUpperCase())
        {//show language list
            output = retrieve_Strings("language",sessionAttributes.native_language,"list");
        }
        else if (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"category_list").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"category_list").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"theme_list").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"theme_list").toUpperCase())
        {//show category list
            section =  createReturnList('category',sessionAttributes,retrieveFromJson(sessionAttributes),"native");
            output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+". "+section;
        }
        else //something was wrong in the selection of the user. information not available
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");
        //updating the session Attributes
        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "IndexIntent",
                voice: retrieve_Strings("voices",sessionAttributes.native_language),
                break: 0,
                rate: "100%",
                volume: "medium",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};

/**
 * Custom Intent to handle the request to show the list of categories/subcategories.
 * User must trigger the option slot to activate this intention.
 */
const ShowCategoriesIntent ={
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'ShowCategoriesIntent';
    },
    handle(handlerInput)
    {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const option = slots['option'].value;
        let output = "";
        if (sessionAttributes.learning_language == "none")
        {//learning language not configured
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");
        }
        else
        {//learning language is set
            if (option)
            {//option is given. Always true
                let section;
                if (option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"categories").toUpperCase()
                    || option.toUpperCase() ==  checkEditor("option_list",sessionAttributes.learning_language,"categories").toUpperCase()
                    ||option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"themes").toUpperCase()
                    || option.toUpperCase() ==  checkEditor("option_list",sessionAttributes.learning_language,"themes").toUpperCase())
                {//user requested to display all categories available
                    section =  createReturnList('category',sessionAttributes,retrieveFromJson(sessionAttributes),"native");
                    if (section != undefined)// check if section list retrieved without errors
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+ ". "+section;
                    else
                        output += retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                }
                else if (option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"subcategories").toUpperCase()
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.learning_language,"subcategories").toUpperCase()
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"topics").toUpperCase()
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.learning_language,"topics").toUpperCase())
                {//user requested to display all subcategories available
                    //category must be selected first for this
                    if (sessionAttributes.category == undefined)
                    {//no category is selected
                        output+= retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");
                    }
                    else
                    {//category is set before
                        section= createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,sessionAttributes.category),"native");
                        if (section != undefined) // check if section list retrieved without errors
                        {
                            output+= retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list");
                            for (var i=0;i<section.length;i++)
                            {
                                output += i==0 ? " " : ", ";
                                output += section[i].replace(","," and")+" ";
                            }
                        }
                        else
                            output += retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                    }
                }
                else
                {//request is not matched for showing categories or subcategories in native or learning language
                 //=> request given in different language
                    output+= retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                }
            }
        }

        //updating the session Attributes
        Object.assign(sessionAttributes,
        {
            lastmsg: output,
            helpmsg: "ShowCategories",
            break: 0,
            voice: retrieve_Strings("voices",sessionAttributes.native_language),
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    }
}

/**
 * Custom intent to select random category/subcategory
 */
const UserSelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'UserSelectionIntent';
    },
    handle(handlerInput)
    {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        /* Const values for slots*/
        const option = slots['option_selection'].value;


        //subcategory length.
        let sub_length = sessionAttributes.subcategories_length != undefined ? sessionAttributes.subcategories_length : 0;
        let examples_length = sessionAttributes.examples_length != undefined ? sessionAttributes.examples_length : 0;
        let category = sessionAttributes.category;
        let subcategory = sessionAttributes.subcategory;
        let subcategory_ids = sessionAttributes.subcategory_ids ? sessionAttributes.subcategory_ids : [];
        var output="";

        // if learning language selected doesn't show anything here..
        if (sessionAttributes.learning_language == "none")
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");
        }
        else
        {//learning language set, safe to proceed
            if (option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"category").toUpperCase()
                || option.toUpperCase() ==  checkEditor("random_option_list",sessionAttributes.learning_language,"category").toUpperCase()
                || option.toUpperCase() ==  checkEditor("random_option_list",sessionAttributes.native_language,"theme").toUpperCase()
                || option.toUpperCase() ==  checkEditor("random_option_list",sessionAttributes.learning_language,"theme").toUpperCase())
            {//option is given in native or learning language for keyword category
                const section = createReturnList('category',sessionAttributes,retrieveFromJson(sessionAttributes),"native");
                if (section != undefined)
                {
                    //removing value of subcategory
                    subcategory = undefined;
                    //removing values of subcategories ids
                    subcategory_ids = [];
                    category = section[Math.floor(Math.random()*section.length)];
                    //message for new category selection
                    output += retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+" . ";
                    //message for subcategory list available
                    output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list");
                    //get subcategory list.
                    const subcategory_list = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,category),"native");
                    //updating value of subcategories length
                    sub_length = subcategory_list.length;
                    //reseting the length of the examples. no subcategory set at this point.
                    examples_length = 0;
                    if (subcategory_list != undefined)
                    {
                        for (var i=0; i< subcategory_list.length; i++)
                        {//for showing the correct format of the subcategory name
                            output += i==0 ? " " : ", ";
                            output +=subcategory_list[i].replace(","," and")+" ";
                        }
                    }
                    else
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                }
                else
                    output += retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
            }
            else if (option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"subcategory").toUpperCase()
                    || option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.learning_language,"subcategory").toUpperCase()
                    || option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"topic").toUpperCase()
                    || option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.learning_language,"topic").toUpperCase())
            {//option is given in native or learning language for keyword subcategory
                if (category != undefined)
                {//category is set. moving to randomizing subcategories
                    const subcategory_list = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,category),"native");
                    if (subcategory_list!= undefined)
                    {
                        const id = Math.floor(Math.random()*subcategory_list.length); //to set for array position
                        subcategory = subcategory_list[id];

                        examples_length = createReturnList("word",sessionAttributes,[retrieveFromJson(sessionAttributes,category,subcategory)],"native",true)[0].length;
                        let exists=false;
                        //check if subcaregory already exists. don't add again.
                        for (let i=0; i<subcategory_ids.length; i++)
                        {
                            if (subcategory_ids[i]==id)
                            {
                                exists = true;
                                break;
                            }
                            else
                                exists = false;
                        }
                        //add the subcategory id to the list if it wasn't added before
                        if (exists == false)
                            subcategory_ids.push(id);
                        //sorting the subcategory ids
                        subcategory_ids.sort(sortIds);
                        //message for new category selection
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory.replace(","," and")+" . ";
                    }
                }
                else
                    output += retrieve_Strings("warnings",sessionAttributes.native_language,"not_category");
            }
            else
            {//return message for wrong keyword
                output+= retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
            }
        }
        //update values of session attributes
        Object.assign(sessionAttributes,
        {
            lastmsg: output,
            helpmsg: "UserSelection",
            category: category,
            subcategory: subcategory, //changing category, means reseting the subcategory name
            subcategory_ids: subcategory_ids, //if category is changed then the subcategory_ids will be reset
            subcategories_length: sub_length != undefined ? sub_length : 0,//maximum number of category's subcategories
            examples_ids: [], //changing category or subcategory => reset the examples
            examples_length: examples_length,//length of current subcategory's examples
            voice: retrieve_Strings("voices",sessionAttributes.native_language),
            break: 0,
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(output)
        .getResponse();
    }
}

/**
 * Custom Intent to handle the user request to select a new category
 * Only triggered when given the command to set a category
 */
const UserCategorySelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'UserCategorySelectionIntent';
    },
    handle(handlerInput)
    {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        //the value of query_response should be a category name
        const query_response = slots['query'].value;
        //value for next theme request
        const next_theme = slots['next_theme'].value;

        let category = sessionAttributes.category;
        let subcategory = sessionAttributes.subcategory;
        let output = "";

        //subcategory length.
        let sub_length = sessionAttributes.subcategories_length != undefined ? sessionAttributes.subcategories_length : 0;
        //examples length
        let examples_length = sessionAttributes.examples_length != undefined ? sessionAttributes.examples_length : 0;
        // if learning language selected doesn't show anything here..
        
        if (sessionAttributes.learning_language == "none")
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");
        }
        else
        {//learning language is configured, safe to proceed
            //getting all categories names in native and learning language
            const category_list = createReturnList('category',sessionAttributes,retrieveFromJson(sessionAttributes),"all");
            if (category_list != undefined)
            {
                //request to select category by name or number
                if (query_response != undefined)
                {
                    //returns the numerical value of category in the category index.
                    //checks if request was given through the actual name or the index value of category
                    const position = check_if_Number(query_response) == "true" ? infoFound(query_response,category_list) : check_if_Number(query_response);
                    //checks if given position exists and is within range of categories index
                    if (position != undefined && position < category_list.length)
                    {//category requested is found. update values
                        //to provide the native version of category
                        category = category_list[position<category_list.length/2 ? position : position-(category_list.length/2)];
                        //updating subcategory value
                        subcategory = undefined;
                        //updating examples length value
                        examples_length = 0;
                        //message for new category selection
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+" . ";
                        //message for subcategory list available
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list");
                        //get subcategory list.
                        const subcategory_list = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,category),"native");
                        //updating subcategories length value
                        sub_length = subcategory_list.length;
                        if (subcategory_list != undefined)
                        {
                            for (var i=0; i< subcategory_list.length; i++)
                            {
                                output += i==0 ? " " : ", ";
                                output +=subcategory_list[i].replace(","," and")+" ";
                            }
                        }
                        else
                            output = query_response+retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                    }
                    else
                    {//category name given was not valid/not found, assume given in different language
                        output = query_response+retrieve_Strings("warnings",sessionAttributes.native_language,"name_not_found");
                    }
                }
                else
                {//request to select next theme/category.
                    //check if request for next category/theme given in appropriate language
                    if (next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.native_language,"next_category").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.learning_language,"next_category").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.native_language,"another_category").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.learning_language,"another_category").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.native_language,"next_theme").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.learning_language,"next_theme").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.native_language,"another_theme").toUpperCase()
                        || next_theme.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.learning_language,"another_theme").toUpperCase())
                    {
                        if (category == undefined)
                        {//no category/theme selected prior to this request. Add the first category available.
                            //first category in the list
                            category = category_list[0];
                        }
                        else
                        {//category/theme was defined before, need to add the very next one.
                            //find the position of the current category in the list
                            const position = infoFound(category,category_list);
                            if (position != undefined && position < category_list.length)
                            {//position of current category/theme found
                                //check if current category is the last one in list (add the first one again in that case)
                                category = (position + 1) < category_list.length/2 ? category_list[position+1] : category_list[0];
                            }
                            else
                            {//category name given was not valid/not found, assume given in different language
                                output = next_theme+retrieve_Strings("warnings",sessionAttributes.native_language,"name_not_found");
                            }
                        }
                        //updating values after new category/theme
                        //updating subcategory value
                        subcategory = undefined;
                        //updating examples length value
                        examples_length = 0;
                        //message for new category selection
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+" . ";
                        //message for subcategory list available
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list");
                        //get subcategory list.
                        const subcategory_list = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,category),"native");
                        //updating subcategories length value
                        sub_length = subcategory_list.length;
                        if (subcategory_list != undefined)
                        {
                            for (var i=0; i< subcategory_list.length; i++)
                            {
                                output += i==0 ? " " : ", ";
                                output +=subcategory_list[i].replace(","," and")+" ";
                            }
                        }
                        else
                            output = next_theme+retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                    }
                    else
                        output+= retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                }
            }
            else
            {//return message for content error
                output+= retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
            }
        }
        //update values of session attributes
        Object.assign(sessionAttributes,
        {
            lastmsg: output,
            helpmsg: "UserSelectionCategory",
            category: category,
            subcategory: subcategory,
            subcategory_ids: [], //reseting values of subcategory ids, new category
            subcategories_length: sub_length,//maximum number of category's subcategories
            examples_ids: [], //reseting values of examples, new category,
            examples_length: examples_length, // length of examples of subcategory
            native_word: undefined,
            native_phrase: undefined,
            learning_word:undefined,
            learning_phrase: undefined,
            voice: retrieve_Strings("voices",sessionAttributes.native_language),
            break: 0,
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(output)
        .getResponse();
    }
}

/**
 * Custom Intent to handle the user request to select a new subcategory
 * Only triggered when given the command to set a subcategory
 */
const UserSubcategorySelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'UserSubcategorySelectionIntent';
    },
    handle(handlerInput)
    {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        //value of query_response must be a subcategory name
        const query_response = slots['query'].value;
        let subcategory = sessionAttributes.subcategory;
        let output = "";
        let subcategory_ids = sessionAttributes.subcategory_ids == undefined ? [] : sessionAttributes.subcategory_ids;
        let examples_length = sessionAttributes.examples_length != undefined ? sessionAttributes.examples_length : 0;
        // if learning language selected doesn't show anything here..
        if (sessionAttributes.learning_language == "none")
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");
        }
        else
        {//learning language is configured, safe to proceed
            //check for category to be defined first
            if (sessionAttributes.category)
            {//category is set
                const subcategory_list = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,sessionAttributes.category),"all");
                //output +=subcategory_list;
                if (subcategory_list != undefined)
                {
                    //id in list of native and learning subcategory names
                    //returns the numerical value of category in the category index.
                    //checks if request was given through the actual name or the index value of category
                    const id = check_if_Number(query_response) == "true" ? infoFound(query_response,subcategory_list) : check_if_Number(query_response);
                    if (id!= undefined && id < subcategory_list.length)
                    {//subcategory requested is found.
                        subcategory = subcategory_list[id<subcategory_list.length/2 ? id : id-(subcategory_list.length/2)];
                        //setting examples length
                        examples_length = createReturnList("word",sessionAttributes,[retrieveFromJson(sessionAttributes,sessionAttributes.category,subcategory)],"native",true)[0].length;
                        let exists=false;
                        //check if subcaregory already exists. don't add again.
                        for (let i=0; i<subcategory_ids.length; i++)
                        {
                            if (subcategory_ids[i]==id)
                            {
                                exists = true;
                                break;
                            }
                            else
                                exists = false;
                        }
                        //add the subcategory id to the list if it wasn't added before
                        if (exists == false)
                            subcategory_ids.push(id);
                        //sorting the subcategory ids
                        subcategory_ids.sort(sortIds);
                        //message for new category selection
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory.replace(","," and")+" . ";
                    }
                    else
                    {//category name given was not valid/not found, assume given in different language
                        output += query_response+retrieve_Strings("warnings",sessionAttributes.native_language,"name_not_found");
                    }
                }
                else
                {
                    output+= retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                }

            }
            else
            {
                output+= retrieve_Strings("warnings",sessionAttributes.native_language,"not_category");
            }
        }

        //update values of session attributes
        Object.assign(sessionAttributes,
        {
            lastmsg: output,
            helpmsg: subcategory != undefined ? "UserSelectionSubcategory" : "ShowCategories",
            subcategory: subcategory,
            subcategory_ids: subcategory_ids,
            examples_ids: [], //new subcategory, reseting examples..
            examples_length: examples_length,//length of current subcategory's examples
            voice: retrieve_Strings("voices",sessionAttributes.native_language),
            break: 0,
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(output)
        .getResponse();
    }
}

/**
 * Custom Intent to set the next Example for the user
 * User can select to see next or random example.
 */
const ExampleIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'ExampleIntent';
    },
    handle(handlerInput)
    {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let resume = slots['continue'] != undefined ? slots['continue'].value : undefined;
        let random = slots['random_example'] != undefined ? slots['random_example'].value : undefined;
        let output="";
        let category = sessionAttributes.category;
        let subcategory = sessionAttributes.subcategory;
        let examples_ids = sessionAttributes.examples_ids == undefined ? [] : sessionAttributes.examples_ids;
        let subcategory_ids = sessionAttributes.subcategory_ids == undefined ? [] : sessionAttributes.subcategory_ids;
        let examples_length = sessionAttributes.examples_length == undefined ? 0 : sessionAttributes.examples_length;
        let subcategories_length = sessionAttributes.subcategories_length == undefined ? 0 : sessionAttributes.subcategories_length;
        let keyword_check;
        if (sessionAttributes.learning_language == "none")
        {//learning language not configured
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");
        }
        else
        {//learning language is set
            if (category == undefined || subcategory == undefined)
            {//both category and subcategory must be set before continuing with this
                output += retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");
            }
            else
            {//safe to proceed further checks.
                if (resume != undefined)
                {//resume keyword triggered
                    if (resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"another").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"another").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"next").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"next").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"start").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"start").toUpperCase())
                    {//keyword given correctly
                        keyword_check = true;
                    }
                    else
                    {//keyword was given in a different language.
                        output += retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                        keyword_check = false;
                    }
                }
                if (random != undefined)
                {//random keyword triggered
                    if ((random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"shuffle").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"shuffle").toUpperCase()))
                    {
                        keyword_check = true;
                    }
                    else
                    {
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                        keyword_check = false;
                    }
                }
                if (keyword_check)
                {
                    let test_count = 0;
                    let new_example_entry;
                    let change = 0 ; //0 = no change, 1 = subcategory change, 2 = category change
                    while(new_example_entry == undefined || new_example_entry == false)
                    {//while loop until a valid example is found.
                        test_count ++;
                        if (examples_ids.length < examples_length)
                        {//still valid examples in current subcategory. Get next example from there

                            /* setting the example proces */
                            //get the subcategory section information
                            const subcategory_section = [retrieveFromJson(sessionAttributes,category,subcategory)];
                            //create the object for the subcategory info
                            const subcategory_info = Object.assign({},{//value in each field will have the String value or "false" value -> doesn't exist for that example
                                native_words: createReturnList("word",sessionAttributes,subcategory_section,"native",true)[0],
                                learning_words: createReturnList("word",sessionAttributes,subcategory_section,"learning",true)[0],
                                native_phrases: createReturnList("phrase",sessionAttributes,subcategory_section,"native",true)[0],
                                learning_phrases: createReturnList("phrase",sessionAttributes,subcategory_section,"learning",true)[0]
                            });
                            new_example_entry = getExample(subcategory_info,examples_ids,random);
                            break;
                        }
                        else
                        {//all examples of current subcategory are done. change subcategory.
                            if (subcategory_ids.length < subcategories_length)
                            {//change subcategory in same category
                                //TODO: set examples_ids = 0, examples_length -> to current subcategory length
                                let id;
                                for (id = 0;id <subcategory_ids.length; id++)
                                {//loop until an id is not found in sequencial order. (if randomly added a subcategory)
                                    if (subcategory_ids[id] > id)
                                    {//greater subcategory id (randomly added before) is found. change to undone subcategory
                                        break;
                                    }
                                }
                                //if all subcategories were added sequencially then, id holds the value of the very next subcategory id.
                                //adding new subcategory id to ids list
                                subcategory_ids.push(id);
                                //sorting the ids.
                                subcategory_ids.sort(sortIds);
                                //reseting the values of examples ids
                                examples_ids = [];
                                //updating value of subcategory
                                subcategory = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,sessionAttributes.category),"native")[id];
                                //setting value of examples length in current subcategory
                                examples_length = createReturnList("word",sessionAttributes,[retrieveFromJson(sessionAttributes,category,subcategory)],"native",true)[0].length;
                                change = 1;
                            }
                            else
                            {//change category and add first subcategory
                                //TODO: set examples_ids = 0, examples_length -> to current subcategory length, set subcategories_ids = 0, subcategories_length -> current category length
                                //reset subcategory ids
                                subcategory_ids = [];
                                //reset example ids
                                examples_ids = [];
                                //get categories names
                                const categories_info = createReturnList('category',sessionAttributes,retrieveFromJson(sessionAttributes),"native");
                                //current category id
                                const current_category_id = infoFound(category,categories_info);
                                //check which category is next and update the category value
                                category = (current_category_id == categories_info.length-1) ? categories_info[0] : categories_info[current_category_id+1];
                                //updating value of new subcategory
                                subcategory = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes,category),"native")[0];
                                //pushing to subcategory_ids the first sub_id.
                                subcategory_ids.push(0);
                                //setting value of examples length in current subcategory
                                examples_length = createReturnList("word",sessionAttributes,[retrieveFromJson(sessionAttributes,category,subcategory)],"native",true)[0].length;
                                change = 2;
                            }
                        }
                    }
                    if (change == 1)
                    {
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_completed");
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"next_subcategory")+" "+subcategory.replace(","," and")+" . ";
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory.replace(","," and")+" . ";
                    }
                    else if (change == 2)
                    {
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_completed");
                        output += retrieve_Strings("general",sessionAttributes.native_language,"category_completed");
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_category")+" "+category+". ";
                        output += retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory.replace(","," and")+" . ";
                    }
                    //proceeding to seting up example.
                    if (new_example_entry)
                    {//example validation done. updating values
                        //updating the values of current example to the session attributes.
                        Object.assign(sessionAttributes,new_example_entry);
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        Object.assign(sessionAttributes,
                            {
                                voice: retrieve_Strings("voices",sessionAttributes.learning_language),
                                break: 1,
                                level: "strong",
                            });
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        output = output+switchVoice(sessionAttributes.learning_word,sessionAttributes)+". ";
                        Object.assign(sessionAttributes,
                            {
                                voice: retrieve_Strings("voices",sessionAttributes.native_language),
                                break: 1,
                                level: "strong",
                            });
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        output = output+" "+switchVoice(sessionAttributes.native_word,sessionAttributes)+". ";
                    }
                }
            }
        }

        //updating the session Attributes
        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                subcategory: subcategory,
                subcategory_ids: subcategory_ids,
                examples_length: examples_length,
                helpmsg: (category!= undefined && subcategory != undefined) ? "ExampleIntent" : "ShowCategories",
                break: 0,
                rate: "100%",
                volume: "medium",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);

        return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(output)
        .getResponse();
    },
}

/**
 * Custom Intent to show current example details.
 * word or phrase. (in both languages - native & learning)
 */
const DetailsIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'DetailsIntent';
    },
    handle(handlerInput)
    {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        const detail = slots['detail'].value;
        let language = slots['language'].value;
        let output ="";
        let language_request_english = returnSpokenLanguage(language); //language that the request was given. (in english)

        if (sessionAttributes.category == undefined || sessionAttributes.subcategory == undefined )
        {//in case category or subcategory were reset prior to this request
            output = retrieve_Strings("help",sessionAttributes.native_language,"show_categories");
            Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "ShowCategories",
                voice: retrieve_Strings("voices",sessionAttributes.native_language),
                break: 0,
                rate: "100%",
                volume: "medium",
            });
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }
        else
        {//valid to proceed. category and subcategory are set.
            if (language !=undefined
                && language_request_english.toUpperCase() != sessionAttributes.learning_language.toUpperCase()
                && language_request_english.toUpperCase() != sessionAttributes.native_language.toUpperCase())
            {//request given in different language
                output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
            }
            else if (sessionAttributes.category == undefined || sessionAttributes.subcategory == undefined) // category and subcategory were reset prior to this request
                output = retrieve_Strings("help",sessionAttributes.native_language,"show_categories");
            else
            {
                if (sessionAttributes.examples_ids != undefined && sessionAttributes.examples_ids.length>0)
                {//validation for existance of an example
                    if (language == undefined)
                        language = sessionAttributes.native_language;

                    if (language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.native_language,sessionAttributes.native_language).toUpperCase()
                    && language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.native_language,sessionAttributes.learning_language).toUpperCase()
                        && language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.native_language).toUpperCase()
                        && language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.learning_language).toUpperCase() )
                    {//request given in different language
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                    }
                    else
                    {//validation for languages completed
                        if (detail.toUpperCase() == checkEditor("details_list",sessionAttributes.native_language,"word").toUpperCase()
                            || detail.toUpperCase() == checkEditor("details_list",sessionAttributes.learning_language,"word").toUpperCase())
                        {//user requested to see the word of the example
                            if (language.toUpperCase() == sessionAttributes.native_language.toUpperCase()
                                || language.toUpperCase() == retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.native_language.toUpperCase()).toUpperCase())
                            {//in native language
                                Object.assign(sessionAttributes,
                                    {
                                        voice:retrieve_Strings("voices",sessionAttributes.native_language),
                                    });
                                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                                output = switchVoice(sessionAttributes.native_word,sessionAttributes);
                            }
                            else if (language.toUpperCase() == sessionAttributes.learning_language.toUpperCase()
                            || language.toUpperCase() == retrieve_Strings("translation",sessionAttributes.native_language,sessionAttributes.learning_language.toUpperCase()).toUpperCase()
                            || language.toUpperCase() == retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.learning_language.toUpperCase()).toUpperCase())
                            {//in learning language
                                Object.assign(sessionAttributes,
                                    {
                                        voice:retrieve_Strings("voices",sessionAttributes.learning_language),
                                    });
                                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                                output = switchVoice(sessionAttributes.learning_word,sessionAttributes);
                            }
                            //level = "strong";
                        }
                        else if (detail.toUpperCase() == checkEditor("details_list",sessionAttributes.native_language,"phrase").toUpperCase()
                            || detail.toUpperCase() == checkEditor("details_list",sessionAttributes.learning_language,"phrase").toUpperCase())
                        {//user requested to see the phrase of the example
                            if (language.toUpperCase() == sessionAttributes.native_language.toUpperCase() || language.toUpperCase() == retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.native_language.toUpperCase()).toUpperCase())
                            {//in native language
                                Object.assign(sessionAttributes,
                                    {
                                        voice:retrieve_Strings("voices",sessionAttributes.native_language),
                                    });
                                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                                output = switchVoice(sessionAttributes.native_phrase,sessionAttributes);
                            }
                            else if (language.toUpperCase() == sessionAttributes.learning_language.toUpperCase() || language.toUpperCase() == retrieve_Strings("translation",sessionAttributes.native_language,sessionAttributes.learning_language.toUpperCase()).toUpperCase())
                            {//in learning language
                                Object.assign(sessionAttributes,
                                    {
                                        voice:retrieve_Strings("voices",sessionAttributes.learning_language),
                                    });
                                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                                output = switchVoice(sessionAttributes.learning_phrase,sessionAttributes);
                            }
                            //level = "strong";
                        }
                        else
                            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                    }
                    //updating the session Attributes
                    Object.assign(sessionAttributes,
                        {
                            lastmsg: output,
                            helpmsg: "DetailsIntent",
                            voice: retrieve_Strings("voices",sessionAttributes.native_language),
                            break: 1,
                            rate: "100%",
                            volume: "medium",
                        });
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                }
                else
                {//no example was selected previous this request.
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"example");
                    //updating the session Attributes
                    Object.assign(sessionAttributes,
                        {
                            lastmsg: output,
                            helpmsg: "Launch",
                            voice: retrieve_Strings("voices",sessionAttributes.native_language),
                            break: 0,
                            rate: "100%",
                            volume: "medium",
                        });
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                }
            }
        }


        //setting appropriate voice for the return message.
        output = switchVoice(output,sessionAttributes);

        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};

// USER DEFINED FUNCTIONS

/**
 * @description Returns a specific section of the content file
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} category Name of category in JSON format
 * @param {String} subcategory Name of subcategory in JSON fromat
 *
 * @return Object of specified section of content file
 */
function retrieveFromJson(sessionAttributes,category = undefined,subcategory = undefined)
{
    if (category == undefined && subcategory == undefined)
    {//return the categories info section for all categories
        //categories info is static section in all json vocabulary files created
        return skill_files.content().CATEGORIES_INFO;
    }
    else if(category!= undefined && subcategory == undefined)
    {//category given, must retrieve the category section.
        //must transform the category name into english (json static field values)
        //get the values of all categories info. to transform the name
        const cat_info_keys = Object.values(skill_files.content().CATEGORIES_INFO);
        for (var j=0; j<cat_info_keys.length; j++)
        {
            if (removeSSML(languageProvider(sessionAttributes.learning_language,cat_info_keys[j],"category")).toUpperCase() == category.toUpperCase() || languageProvider(sessionAttributes.native_language,cat_info_keys[j],"category").toUpperCase() == category.toUpperCase())
            {//category name found in learning or native language
                category = removeSSML(languageProvider("english",cat_info_keys[j],"category"));
            }
        }
        const keys = Object.keys(skill_files.content());
        //to skip the categories_info section
        for (var i=1; i<keys.length; i++)
            if (keys[i].toUpperCase() == category.toUpperCase().split(" ").join("_"))
            {//found here
                return Object.values(skill_files.content())[i];
            }
        return undefined;
    }
    else if (category != undefined && subcategory != undefined)
    {
        let test_out="";
        //section of category containing all subcategories
        const category_sections = retrieveFromJson(sessionAttributes,category);

        for (var k=0; k<category_sections.length; k++)
        {//find correct subcategory section
            if ( removeSSML(languageProvider(sessionAttributes.learning_language,category_sections[k],"title")).toUpperCase()== subcategory.toUpperCase()
                || removeSSML(languageProvider(sessionAttributes.native_language,category_sections[k],"title")).toUpperCase()== subcategory.toUpperCase())
            {//found clean subcategory name
                return category_sections[k];
            }
            else
                test_out+= 'nope for '+k;

        }
        return "here:"+test_out;
    }
    return undefined;
}

/**
 * @description Checks if the given keyword (category or subcategory) exists for the selected languages
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} query_response Name of category or subcategory
 * @param {Array} category_list List of category/subcategory names to check
 *
 * @return Position in list or undefined if not found
 */
function infoFound(query_response, category_list)
{
    for (var i=0; i<category_list.length/2; i++)
    {
        if (category_list[i].toUpperCase() == query_response.toUpperCase()
            || category_list[i].toUpperCase() == query_response.replace(" and",",").toUpperCase()
            || category_list[category_list.length/2+i].toUpperCase() == query_response.toUpperCase()
            || category_list[category_list.length/2+i].toUpperCase() == query_response.replace(" and",",").toUpperCase())
            return category_list[i].toUpperCase() == query_response.toUpperCase() ? i : category_list.length/2+i;
    }
    return undefined;
}

/**
 * @description Takes the custom parameters and creates and returns a clean list (no ssml tags) of content information
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} option The type of section to return from the language provider options
 * @param {Object} sessionAttributes Object that contains the session attributes of the user
 * @param {Object} section_info Json Section retrieved from the content file
 * @param {String} return_option Option for the return values
 *
 * @return the list of categories/subcategories or undefined if content error
 */
function createReturnList(option,sessionAttributes,section_info,return_option,tags = false)
{
    //2 languages to check in the categories info list.
    const learning_language = sessionAttributes.learning_language;
    const native_language = sessionAttributes.native_language;

    if (section_info != undefined)
    {//successfully retrieved the section info
        var learning_list = [section_info.length];
        var native_list = [section_info.length];
        //get the categories info section from json.
        if (learning_language != undefined)
        {
            for (var i=0; i < section_info.length; i++)
            {
                const learning_title = languageProvider(learning_language,section_info[i],option);
                const native_title = languageProvider(native_language,section_info[i],option);
                if (tags)
                {
                    native_list[i]= native_title == undefined ? "false" : native_title;
                    learning_list[i]= learning_title == undefined ? "false" : learning_title;
                }
                else
                {
                    native_list[i]= removeSSML(native_title) == "false" ? "false" : removeSSML(native_title);
                    learning_list[i]= removeSSML(learning_title) == "false" ? "false" : removeSSML(learning_title);
                }
            }
            if (return_option == "all")
                return native_list.concat(learning_list);
            else if (return_option == "native")
                return native_list;
            else if (return_option == "learning")
                return learning_list;
        }
    }
    return undefined;
}

/**
 * @description Takes parameter a string and removes any ssml tags included before. Returns clean text.
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} ssmltext Text with ssml tags
 *
 * @return text with tags stripped
 */
function removeSSML(ssmltext)
{
    if (ssmltext == undefined)
        return "false";
    //index variable to remove the ssml tags from the values
    var index = ssmltext.indexOf('<');
    let tag;
    while(index!=-1)
    {
        //to cleanse the text
        tag = ssmltext.substring(index,ssmltext.indexOf('>')+1);
        ssmltext = ssmltext.replace(tag,"");
        index = ssmltext.indexOf('<');
    }
    return ssmltext;
}

/**
 * @description Finds and returns a new example
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {Object} subcategory_info Current subcategory information for all examples
 * @param {Array} examples_ids All examples' ids already done
 * @param {Boolean} random  Whether to set a random or next example
 */
function getExample(subcategory_info,examples_ids,random)
{
    let example_id;
    //To find the examples not shown yet.
    if (random)
    {//random example is enabled here
            while(example_id == undefined)
            {
                //next random example id
                example_id = Math.floor(Math.random()*subcategory_info.native_words.length);
                for (let i=0; i<examples_ids.length; i++)
                {
                    if (examples_ids[i] == example_id)
                    {//example id found reset random id
                        example_id = undefined;
                        break;
                    }
                }
            }
    }
    else
    {//just the next.. (all checks for end of subcategory is done before this.)
        if (examples_ids.length == 0)
        {//first example of a new category
            example_id = 0;
        }
        else
        {//find next available example
            for(let i=0; i<examples_ids.length; i++)
            {//loop through all examples ids.
                if (examples_ids[i] > i)
                {//sorted list
                    example_id = i;
                    break;
                }
            }
             //examples were done in sequence add he very next
            if (example_id == undefined)
                example_id = examples_ids.length;
        }
    }
    if (example_id != undefined)
    {//id of next example is set
        examples_ids.push(example_id);
        //Object value of next example information
        return Object.assign({},
        {
            native_word: subcategory_info.native_words[example_id],
            learning_word: subcategory_info.learning_words[example_id],
            native_phrase: subcategory_info.native_phrases[example_id],
            learning_phrase: subcategory_info.learning_phrases[example_id],
            examples_ids: examples_ids.sort(sortIds),
        });
    }
    else
        return false;
}

/**
 * @description Returns the text given with ssml tags for modifiation in the return message of Alexa
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {Strings} text : text given to modify before returing
 * @param {Object} sessionAttributes  Object that contains the session attributes of the user
 *
 * @return String Spoken message for Alexa with ssml tags for customization.
 */
function switchVoice(text,sessionAttributes) {
    if (text){
        return "<voice name = '"+sessionAttributes.voice +"'><break time='"+sessionAttributes.break+"s'/><prosody rate='"+sessionAttributes.rate+"' volume='"+sessionAttributes.volume+"'>"+text+"</prosody></voice>"
    }
  }

/**
 * @description Returns the selected value from the content file, given a specific key and language option
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} language language that the value will be returned
 * @param {Object} info Object that holds all the info for the current section
 * @param {String} option category | subcategory | example | word | phrase: which part of the section to return
 *
 * @return Value requested or false if not found.
 */
function languageProvider(language,info,option)
{
    if (option == "category")
    {//inside CATEGORIES_INFO.
        switch(language.toUpperCase())
        {
            case "ENGLISH":
                return info.english_title;
            case "SPANISH" :
                return info.spanish_title;
            case "GERMAN":
                return info.german_title;
            case "FRENCH":
                return info.french_title;
            case "ITALIAN":
                return info.italian_title;
        }
    }
    else if (option == "subcategory")
    {//inside CATEGORIES_INFO.
        switch(language.toUpperCase())
        {
            case "ENGLISH":
                return info.english_sub;
            case "SPANISH":
                return info.spanish_sub;
            case "GERMAN":
                return info.german_sub;
            case "FRENCH":
                return info.french_sub;
            case "ITALIAN":
                return info.italian_sub;
        }
    }
    else if (option == "title")
    {//inside a category content information
        switch(language.toUpperCase())
        {
            case "ENGLISH":
                return info.english_title;
            case "SPANISH":
                return info.spanish_title;
            case "GERMAN":
                return info.german_title;
            case "FRENCH":
                return info.french_title;
            case "ITALIAN":
                return info.italian_title;
        }
    }
    else if (option == "word")
    {
        switch(language.toUpperCase())
        {
            case "ENGLISH":
                return info.english_word;
            case "SPANISH":
                return info.spanish_word;
            case "GERMAN":
                return info.german_word;
            case "FRENCH":
                return info.french_word;
            case "ITALIAN":
                return info.italian_word;
        }
    }
    else if (option == "phrase")
    {
        switch(language.toUpperCase())
        {
            case "ENGLISH":
                return info.english_phrase;
            case "SPANISH":
                return info.spanish_phrase;
            case "GERMAN":
                return info.german_phrase;
            case "FRENCH":
                return info.french_phrase;
            case "ITALIAN":
                return info.italian_phrase;
        }
    }

    return "false";
}

/**
 * @description Takes as parameter 2 numbers and sorts them in a list of ids
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {Integer} id_1 First id to sort
 * @param {Integer} id_2 Second id to sort
 *
 * @return Sorted list of ids
 */
function sortIds(id_1, id_2)
{
    return id_1-id_2;
}

/**
 * @description Responsible to check if given keyword is in correct language.
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} keyword_category  the category of the keyword for all languages.
 * @param {String} language Language to check with
 * @param {String} type  type of keyword.
 *
 * @return Requested keyword or false if not found
 */
function checkEditor(keyword_category,language,type)
{
    let retriever;
    if (language != undefined)
    {
        switch(keyword_category)
        {
            case "language_type":
            {
                retriever = skill_files.editor_options().LANGUAGE_TYPE_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "native":
                                return retriever[i].native;
                            case "mother":
                                return retriever[i].mother;
                            case "teaching":
                                return retriever[i].teaching;
                            case "second":
                                return retriever[i].second;
                            case "learning":
                                return retriever[i].learning;
                        }
                }
            }
            case "speed_list":
            {
                retriever = skill_files.editor_options().SPEED_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "faster":
                                return retriever[i].faster;
                            case "slower":
                                return retriever[i].slower;
                        }
                }
            }
            case "volume_list":
            {
                retriever = skill_files.editor_options().VOLUME_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "louder":
                                return retriever[i].louder;
                            case "quieter":
                                return retriever[i].quieter;
                        }
                }
            }
            case "help_options_list":
            {
                retriever = skill_files.editor_options().HELP_OPTIONS_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "help":
                                return retriever[i].help;
                            case "instructions":
                                return retriever[i].instructions;
                            case "options":
                                return retriever[i].options;
                        }
                }
            }
            case "request_list":
            {
                retriever = skill_files.editor_options().REQUEST_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "current_category":
                                return retriever[i].current_category;
                            case "current_theme":
                                return retriever[i].current_theme;
                            case "current_subcategory":
                                return retriever[i].current_subcategory;
                            case "current_topic":
                                return retriever[i].current_topic;
                            case "current_example":
                                return retriever[i].current_example;
                            case "native_language":
                                return retriever[i].native_language;
                            case "mother_language":
                                return retriever[i].mother_language;
                            case "learning_language":
                                return retriever[i].learning_language;
                            case "language_list":
                                return retriever[i].language_list;
                            case "category_list":
                                return retriever[i].category_list;
                            case "theme_list":
                                return retriever[i].theme_list;
                        }
                }
            }
            case "details_list":
            {
                retriever = skill_files.editor_options().DETAILS_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "word":
                                return retriever[i].word;
                            case "phrase":
                                return retriever[i].phrase;
                        }
                }
            }
            case "continue_in_sub_list":
            {
                retriever = skill_files.editor_options().CONTINUE_IN_SUB_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "more":
                                return retriever[i].more;
                            case "another":
                                return retriever[i].another;
                            case "next":
                                return retriever[i].next;
                            case "reset":
                                return retriever[i].reset;
                            case "restart":
                                return retriever[i].restart;
                            case "start":
                                return retriever[i].start;
                        }
                }
            }
            case "continue_in_cat_list":
            {
                retriever = skill_files.editor_options().CONTINUE_IN_CAT_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "next_category":
                                return retriever[i].next_category;
                            case "another_category":
                                return retriever[i].another_category;
                            case "next_theme":
                                return retriever[i].next_theme;
                            case "another_theme":
                                return retriever[i].another_theme;
                        }
                }
            }
            case "option_list":
            {
                retriever = skill_files.editor_options().OPTION_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "categories":
                                return retriever[i].categories;
                            case "subcategories":
                                return retriever[i].subcategories;
                            case "themes":
                                return retriever[i].themes;
                            case "topics":
                                return retriever[i].topics;
                        }
                }
            }
            case "random_option_list":
            {
                retriever = skill_files.editor_options().RANDOM_OPTION_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "category":
                                return retriever[i].category;
                            case "subcategory":
                            return retriever[i].subcategory;
                            case "topic":
                                return retriever[i].topic;
                            case "theme":
                                return retriever[i].theme;
                        }
                }
            }
            case "repeat_list":
            {
                retriever = skill_files.editor_options().REPEAT_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type.toUpperCase())
                        {//given in english.. by program.
                            case "repeat".toUpperCase():
                                return retriever[i].repeat;
                            case "again".toUpperCase():
                                return retriever[i].again;
                            case "repeat again".toUpperCase():
                                return retriever[i].repeat_again;
                            case "repeat normal".toUpperCase():
                                return retriever[i].repeat_normal;
                        }
                }
            }
            case "random_list":
            {
                retriever = skill_files.editor_options().RANDOM_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "random":
                                return retriever[i].random;
                            case "shuffle":
                                return retriever[i].shuffle;
                        }
                }
            }
        }
    }
    return "false";
}

/**
 * @description Finds and returns the language's name in the requested language
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} language Language to return the native name
 *
 * @return Native name of language or undefined if not found
 */
function returnSpokenLanguage(language)
{
    if (language == undefined)
        return "undefined";
    let retriever = skill_files.content_language_strings().LANGUAGE_TRANSLATIONS;
    for (let i=0;i<retriever.length;i++)
    {
        for (let j=0;j<retriever[i].language.length;j++)
        {
            if (language.toUpperCase() == retriever[i].language[j].toUpperCase())
                switch(j)
                {
                    case 0: return "english";
                    case 1: return "spanish";
                    case 2: return "german";
                    case 3: return "french";
                    case 4: return "italian";
                    default: return "unidentified";
                }
        }
    }
    return "undefined";
}

/**
 * @description Returns a requested message that Alexa will display next
 *
 * @author CharalamposTheodorou
 * @since 1.0
 *
 * @param {String} string_category Category of string to search for
 * @param {String} language Language that the string was requested in
 * @param {String} type Type of message to return.
 *
 * @return Requested string to show or false if not found
 */
function retrieve_Strings(string_category,language,type)
{
    let retriever;
    switch(string_category)
    {
        case "voices":
        {
            retriever = skill_files.content_language_strings().VOICES;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                    return retriever[i].voice;
            }
        }
        case "general":
        {
            retriever = skill_files.content_language_strings().GENERAL_STRINGS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
                    {
                        case "options":
                            return retriever[i].options;
                        case "suggested":
                            return retriever[i].suggested_example;
                        case "category_list":
                            return retriever[i].category_list;
                        case "subcategory_list":
                            return retriever[i].subcategory_list;
                        case "new_category":
                            return retriever[i].new_category;
                        case "new_subcategory":
                            return retriever[i].new_subcategory;
                        case "fallback":
                            return retriever[i].fallback;
                        case "category_completed":
                            return retriever[i].category_completed;
                        case "subcategory_completed":
                            return retriever[i].subcategory_completed;
                        case "next_subcategory":
                            return retriever[i].next_subcategory;
                        case "example":
                            return retriever[i].example;
                    }
                }
            }
        }
        case "help":
        {
            retriever = skill_files.content_language_strings().HELP_STRINGS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
                    {
                        case "launch":
                            return retriever[i].launch;
                        case "show_categories":
                            return retriever[i].show_categories;
                        case "example":
                            return retriever[i].example;
                        case "select_categories":
                            return retriever[i].select_categories;
                        case "details":
                            return retriever[i].details;
                        case "resume":
                            return retriever[i].resume;
                        case "reset":
                            return retriever[i].reset;
                    }
                }
            }
        }
        case "options":
        {
            retriever = skill_files.content_language_strings().OPTION_STRINGS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
                    {
                        case "welcome":
                            return retriever[i].welcome;
                        case "show_categories":
                            return retriever[i].show_categories;
                        case "example":
                            return retriever[i].example;
                        case "select_categories":
                            return retriever[i].select_categories;
                        case "details":
                            return retriever[i].details;
                        case "resume":
                            return retriever[i].resume;
                        case "reset":
                            return retriever[i].reset;
                        case "index":
                            return retriever[i].index;
                    }
                }
            }
        }
        case "warnings":
        {
            retriever = skill_files.content_language_strings().WARNING_STRINGS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
                    {
                        case "category":
                            return retriever[i].category;
                        case "example":
                            return retriever[i].example;
                        case "missing_info":
                            return retriever[i].missing_info;
                        case "no_learning_lang":
                            return retriever[i].no_learning_lang;
                        case "different_request":
                            return retriever[i].different_request;
                        case "same_selection":
                            return retriever[i].same_selection;
                        case "native_selection":
                            return retriever[i].native_selection;
                        case "learning_selection":
                            return retriever[i].learning_selection;
                        case "native_warn":
                            return retriever[i].native_warn;
                        case "learning_warn":
                            return retriever[i].learning_warn;
                        case "reset":
                            return retriever[i].reset;
                        case "given_request":
                            return retriever[i].given_request;
                        case "content_error":
                            return retriever[i].content_error;
                        case "name_not_found":
                            return retriever[i].name_not_found;
                        case "not_category":
                            return retriever[i].not_category;
                        case "cancel_stop":
                            return retriever[i].cancel_stop;
                    }
                }
            }
        }
        case "language":
        {
            retriever = skill_files.content_language_strings().LANGUAGE_STRINGS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
                    {
                        case "list":
                            return retriever[i].list;
                        case "selection":
                            return retriever[i].selection;
                        case "learning":
                            return retriever[i].learning;
                    }
                }
            }
        }
        case "translation":
        {
            retriever = skill_files.content_language_strings().LANGUAGE_TRANSLATIONS;
            for (let i=0;i<retriever.length; i++)
            {
                for (let j=0;j<retriever[i].language.length;j++)
                {
                    if (retriever[i].language[j].toUpperCase() == language.toUpperCase())
                    {
                        switch(type.toUpperCase())
                        {
                            case "GERMAN":
                                return retriever[i].german;
                            case "SPANISH":
                                return retriever[i].spanish;
                            case "ITALIAN":
                                return retriever[i].italian;
                            case "FRENCH":
                                return retriever[i].french;
                            case "ENGLISH":
                                return retriever[i].english;
                            case "RETURN":
                                return retriever[i].language[0];
                            default:
                                return "unidentified";

                        }
                    }
                }
            }
        }
        default:
            return "unidentified";
    }
}

/**
 * @description Checks if request was to give a category by name or number
 * 
 * @author CharalamposTheodorou
 * @since 1.0
 * 
 * @param {String} query_response String to check if contains a numberical value
 * 
 * @return Returns true if doesn't contains a number in the request
 */
function check_if_Number(query_response)
{
    return isNaN(query_response) == true ? "true" : query_response;
}

 /** All Intents declarations */
 const skillBuilder = Alexa.SkillBuilders.custom();
 exports.handler = skillBuilder
   .addRequestHandlers(
     LaunchRequest,
     ExampleIntent,
     SessionEndedRequest,
     HelpIntent,
     CancelAndStopIntentHandler,
     FallbackHandler,
     UserSelectionIntent,
     UserCategorySelectionIntent,
     UserSubcategorySelectionIntent,
     ShowCategoriesIntent,
     RepeatMessageIntent,
     DetailsIntent,
     IndexIntent,
     LanguageSelectionIntent,
   )
   .addRequestInterceptors(LocalizationInterceptor)
   .addErrorHandlers(ErrorHandler)
   .lambda();

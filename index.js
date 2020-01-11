const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const volume_levels = ['silent','x-soft','soft','medium','loud','x-loud'];
const rate_levels = ['40%','50%','60%','75%','90%','100%','120%','150%','200%'];
const content = require('./content');
const content_language_strings = require('./language_strings').CONTENT;

const content_categories_info =  content.CONTENT.CATEGORIES_INFO;
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
            NATIVE_VOICE: "Kendra",
            /* ENGLISH_VOICE: "Kendra",
            SPANISH_VOICE: "Conchita",
            GERMAN_VOICE: "Marlene",
            FRENCH_VOICE: "Celine",
            ITALIAN_VOICE: "Giorgio", */
            SKILL_NAME: 'English Vocabulary',
            FALLBACK_MESSAGE: 'Something was given wrong, please follow the instructions. See you later. ',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            //CATEGORIES_LIST: 'The following list is an index of all categories available. ',
            //SUBCATEGORIES_LIST: 'The following list is an index of all subcategories of category %s. ',
            //NEW_CATEGORY: 'Category selected: %s. ',
            RANDOM_CATEGORY: 'Random category selected: %s. ',
            //NEW_SUBCATEGORY: 'Subcaregory selected: %s. ',
            RANDOM_SUBCATEGORY: 'Random subcategory selected: %s. ',
            NATIVE_EXPLANATION: '%s. ',
            LEARNING_EXPLANATION: '%s. ',
            NATIVE_PHRASE: '%s. ',
            LEARNING_PHRASE: ' %s. ',
            ALL_COVERED: 'All content in subcategory. %s. of category. %s. is completed. ',
            /* HELP_LAUNCH: 'Select a learning language to get started. Say options or instructions to get more help. ',
            HELP_SHOW_CATEGORIES: 'You have to select both a category and a subcategory before preceeding . Random is always an option. ',
            HELP_EXAMPLE: 'Say spanish explanation or english explanation to get the word or spanish phrase or english phrase to get the example. ',
            HELP_SELECT_CATEGORIES: ' You can now say start or next to move to next example. Or say random to get a random example. ',
            HELP_DETAILS: 'Say spanish explanation or english explanation to get the word or spanish phrase or english phrase to get the example. Or %s. ',
            HELP_RESUME: 'Say current and category, subcategory or example to relocate yourself. ',
            HELP_RESET: 'Learning language has changed, select category to continue. ', */
           // NO_CATEGORY: 'No category or subcategory selected before. Please select both first. ',
            //NO_EXAMPLE: 'No example selected before. Nothing to show. ',
            //SUGGESTED_EXAMPLE: 'You can say random category or random subcategory. ',
            FIRST_CATEGORY: ' Let\'s start %s with %s .',
            SUBCATEGORY_COMPLETED: 'All examples of %s of %s are completed. ',
            CATEGORY_COMPLETED: 'All subcategories are completed. ',
            NEXT_SUBCATEGORY: 'Moving to subcategory %s. ',
            //MISSING_INFO: 'Missing some selections, can not provide that information. ',
            /* OPTIONS: 'Say Options to get the available steps. ',
            WELCOME_OPTIONS: 'Say learn and the language. Say language list to get all languages available. ',
            SHOW_CATEGORIES_OPTIONS: 'Say show categories or subcategories to see list of categories or subcategories. ',
            SELECT_CATEGORIES_OPTIONS: 'Say random to give the next random example. Say next to give next in order example. View current subcategory by saying view subcategory. Say next category to move forward. ',
            EXAMPLE_OPTIONS: 'Say random to give the next random example. Say next to give next in order example. View current example by saying view example. ',
            DETAILS_OPTIONS: 'Say the language you want to view and explanation or phrase. ',
            RESET_OPTIONS: 'Say categories list to get list of available categories. ',
            RESUME_OPTIONS: 'Continue where you left of before. Say categories to get the list. ',
            INDEX_OPTIONS: 'Say next or random to continue with the next example. Say current subcategory to get the current subcategory. ', */
            //NO_LEARNING_LANGUAGE: 'You haven\'t selected a learning language. Say language list to hear all options. ',
            //LANGUAGE_SELECTION_INFO: 'Native language is %s and learning language is %s. ',
            //LANGUAGE_LIST: "Languages available are English, Spanish, Italia, French and German. "
            },
    },
    'es-ES':{
        translation: {
            INITIAL_LANGUAGE: "spanish",//language of alexa
            NATIVE_VOICE: "Conchita",
            SKILL_NAME: 'Spanish Vocabulary',
            FALLBACK_MESSAGE: 'Something was given wrong, please follow the instructions. See you later. ',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            RANDOM_CATEGORY: 'Random category selected: %s. ',
            RANDOM_SUBCATEGORY: 'Random subcategory selected: %s. ',
            NATIVE_EXPLANATION: '%s. ',
            LEARNING_EXPLANATION: '%s. ',
            NATIVE_PHRASE: '%s. ',
            LEARNING_PHRASE: ' %s. ',
            ALL_COVERED: 'All content in subcategory. %s. of category. %s. is completed. ',
            FIRST_CATEGORY: ' Let\'s start %s with %s .',
            SUBCATEGORY_COMPLETED: 'All examples of %s of %s are completed. ',
            CATEGORY_COMPLETED: 'All subcategories are completed. ',
            NEXT_SUBCATEGORY: 'Moving to subcategory %s. ',
            },
    },
    'it-IT':{
        translation: {
            INITIAL_LANGUAGE: "italian",//language of alexa
            NATIVE_VOICE: "Giorgio",
            SKILL_NAME: 'Italian Vocabulary',
            FALLBACK_MESSAGE: 'Something was given wrong, please follow the instructions. See you later. ',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            RANDOM_CATEGORY: 'Random category selected: %s. ',
            RANDOM_SUBCATEGORY: 'Random subcategory selected: %s. ',
            NATIVE_EXPLANATION: '%s. ',
            LEARNING_EXPLANATION: '%s. ',
            NATIVE_PHRASE: '%s. ',
            LEARNING_PHRASE: ' %s. ',
            ALL_COVERED: 'All content in subcategory. %s. of category. %s. is completed. ',
            FIRST_CATEGORY: ' Let\'s start %s with %s .',
            SUBCATEGORY_COMPLETED: 'All examples of %s of %s are completed. ',
            CATEGORY_COMPLETED: 'All subcategories are completed. ',
            NEXT_SUBCATEGORY: 'Moving to subcategory %s. ',
            },
    },
    'fr-FR':{
        translation: {
            INITIAL_LANGUAGE: "french",//language of alexa
            NATIVE_VOICE: "Celine",
            SKILL_NAME: 'French Vocabulary',
            FALLBACK_MESSAGE: 'Something was given wrong, please follow the instructions. See you later. ',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            RANDOM_CATEGORY: 'Random category selected: %s. ',
            RANDOM_SUBCATEGORY: 'Random subcategory selected: %s. ',
            NATIVE_EXPLANATION: '%s. ',
            LEARNING_EXPLANATION: '%s. ',
            NATIVE_PHRASE: '%s. ',
            LEARNING_PHRASE: ' %s. ',
            ALL_COVERED: 'All content in subcategory. %s. of category. %s. is completed. ',
            FIRST_CATEGORY: ' Let\'s start %s with %s .',
            SUBCATEGORY_COMPLETED: 'All examples of %s of %s are completed. ',
            CATEGORY_COMPLETED: 'All subcategories are completed. ',
            NEXT_SUBCATEGORY: 'Moving to subcategory %s. ',
            },
    },
    'de-DE':{
        translation: {
            INITIAL_LANGUAGE: "german",//language of alexa
            NATIVE_VOICE: "Marlene",
            SKILL_NAME: 'German Vocabulary',
            FALLBACK_MESSAGE: 'Something was given wrong, please follow the instructions. See you later. ',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            RANDOM_CATEGORY: 'Random category selected: %s. ',
            RANDOM_SUBCATEGORY: 'Random subcategory selected: %s. ',
            NATIVE_EXPLANATION: '%s. ',
            LEARNING_EXPLANATION: '%s. ',
            NATIVE_PHRASE: '%s. ',
            LEARNING_PHRASE: ' %s. ',
            ALL_COVERED: 'All content in subcategory. %s. of category. %s. is completed. ',
            FIRST_CATEGORY: ' Let\'s start %s with %s .',
            SUBCATEGORY_COMPLETED: 'All examples of %s of %s are completed. ',
            CATEGORY_COMPLETED: 'All subcategories are completed. ',
            NEXT_SUBCATEGORY: 'Moving to subcategory %s. ',
            },
    },
  };


// INTENTS
const FallbackHandler = {

    // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  
    //              This handler will not be triggered except in that locale, so it can be
  
    //              safely deployed for any locale.
  
    canHandle(handlerInput) {
  
      const request = handlerInput.requestEnvelope.request;
  
      return request.type === 'IntentRequest'
  
        && request.intent.name === 'AMAZON.FallbackIntent';
  
    },
  
    handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t("FALLBACK_MESSAGE"))
        .getResponse();
    },
};

let LocalizationInterceptor = {
    process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
        lng: handlerInput.requestEnvelope.request.locale,
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        resources: languageString, //HERE//
        returnObjects: true
      });
  
      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function (...args) {
        return localizationClient.t(...args);
      };
    },
};

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      /* 
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); */
    
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
      return handlerInput.responseBuilder
        .speak("ERROR"+sessionAttributes.debug+": "+error.message)
        .getResponse();
    },
};

const SessionEndedRequest = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
  
      return handlerInput.responseBuilder.getResponse();
    },
};

const HelpIntent = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
  
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.HelpIntent' || request.intent.name === 'HelpIntent');
    },
    handle(handlerInput) {
       /*  
        let speakOutput = requestAttributes.t('HELP_START'); 
        handlerInput.attributesManager.setSessionAttributes(speakOutput); */
        
        let helpmsg;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let options = slots['help_options'].value;
        if (options == "help")
        {    
            if (sessionAttributes.helpmsg == "Launch")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"launch");//requestAttributes.t("HELP_LAUNCH");
            }
            else if (sessionAttributes.helpmsg == "ShowCategories")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"show_categories");//requestAttributes.t("HELP_SHOW_CATEGORIES");
            }
            else if (sessionAttributes.helpmsg == "SelectCategories")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"select_categories");//requestAttributes.t("HELP_SELECT_CATEGORIES");
            }
            else if (sessionAttributes.helpmsg == "ExampleIntent")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"example");//requestAttributes.t("HELP_EXAMPLE");
            }
            else if (sessionAttributes.helpmsg == "DetailsIntent")
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"details")+retrieve_Strings("help",sessionAttributes.native_language,"example");//requestAttributes.t("HELP_DETAILS",requestAttributes.t("HELP_EXAMPLE"));
            else if (sessionAttributes.helpmsg == "IndexIntent")
                if (sessionAttributes.learning_language == "none")
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"lauch");//requestAttributes.t("HELP_LAUNCH");
                else
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"show_categories");//requestAttributes.t("HELP_SHOW_CATEGORIES");
            else if (sessionAttributes.helpmsg == "LanguageSelection")
            {//check if selected a category or a subcategory.. or an example, give option to continue where left off
                if (sessionAttributes.reset == false)
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"resume");//requestAttributes.t("HELP_RESUME");
                else
                    helpmsg = retrieve_Strings("help",sessionAttributes.native_language,"reset");//requestAttributes.t("HELP_RESET");
            }
            helpmsg+= retrieve_Strings("general",sessionAttributes.native_language,"options");//requestAttributes.t("OPTIONS");
        }
        else
        {//to give instructions...
            if (sessionAttributes.helpmsg == "Launch")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"welcome");//requestAttributes.t("WELCOME_OPTIONS");
            }
            else if (sessionAttributes.helpmsg == "ShowCategories")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"show_categories");//requestAttributes.t("SHOW_CATEGORIES_OPTIONS")+requestAttributes.t("SUGGESTED_EXAMPLE");
            }
            else if (sessionAttributes.helpmsg == "SelectCategories")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"select_categories");//requestAttributes.t("SELECT_CATEGORIES_OPTIONS");
            }
            else if (sessionAttributes.helpmsg == "ExampleIntent")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"example")+retrieve_Strings("options",sessionAttributes.native_language,"details");////requestAttributes.t("EXAMPLE_OPTIONS")+requestAttributes.t("DETAILS_OPTIONS");
            }
            else if (sessionAttributes.helpmsg == "DetailsIntent")
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"details")+retrieve_Strings("options",sessionAttributes.native_language,"example");////requestAttributes.t("DETAILS_OPTIONS")+requestAttributes.t("EXAMPLE_OPTIONS");
            else if (sessionAttributes.helpmsg == "IndexIntent")
                if (sessionAttributes.learning_language == "none")
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"welcome");//requestAttributes.t("WELCOME_OPTIONS")
                else
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"index");//requestAttributes.t("INDEX_OPTIONS");
            else if (sessionAttributes.helpmsg == "LanguageSelection")
            {
                if (sessionAttributes.reset == false)
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"resume");//requestAttributes.t("RESUME_OPTIONS");
                else
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"reset");//requestAttributes.t("RESET_OPTIONS");
            }
        }
        Object.assign(sessionAttributes,
            {
                lastmsg: helpmsg,
                break: 0,
                rate: "100%",
                volume: "medium",
                voice: retrieve_Strings("voices",sessionAttributes.native_language,false),//requestAttributes.t(sessionAttributes.native_language.toUpperCase()+"_VOICE"),
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        helpmsg = switchVoice(helpmsg,handlerInput.attributesManager.getSessionAttributes());
        return handlerInput.responseBuilder
            .speak(helpmsg)
            .reprompt("HELP REPROMPT")
            .getResponse();
    },
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      /* const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      const speechOutput = requestAttributes.t('QUIT_MESSAGE'); */
  
      return handlerInput.responseBuilder
      .withShouldEndSession(false)
        .speak("CANCEL AND STOP MESSAGE")
        .getResponse();
    },
};

const RepeatMessageIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'RepeatMessageIntent';
    },
    handle(handlerInput)
    {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const speed = slots['speed'].value;
        const volume = slots['volume'].value;
        const repeat = slots['Repeat'].value;

        let repeat_rate = sessionAttributes.rate;
        let repeat_volume = sessionAttributes.volume;
        let output ="Nothing to repeat";
        if (sessionAttributes.lastmsg != undefined)
            output = sessionAttributes.lastmsg;
        
       
        if (speed!= undefined)
        {
            if (speed.toUpperCase() == "faster".toUpperCase())
            {
                for (let i =0;i<rate_levels.length;i++)
                    if (sessionAttributes.rate == rate_levels[i])
                        if (i==rate_levels.length-1)
                            repeat_rate = rate_levels[i];
                        else
                            repeat_rate = rate_levels[i+1];
            }
            else
            {//slower
                for (let i =0;i<rate_levels.length;i++)
                if (sessionAttributes.rate == rate_levels[i])
                    if (i==0)
                        repeat_rate = rate_levels[0];
                    else
                        repeat_rate = rate_levels[i-1];
            }
        }
        else if (volume != undefined)
        {
            if (volume.toUpperCase() == "louder".toUpperCase())
            {
                for (let i=0;i<volume_levels.length;i++)
                {
                    if (sessionAttributes.volume == volume_levels[i])
                        if (i==volume_levels.length-1)
                            repeat_volume = volume_levels[i];
                        else
                            repeat_volume = volume_levels[i+1];
                }
            }
            else
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
        }
        else if (repeat.toUpperCase() == "Repeat normal".toUpperCase())
        {
            repeat_rate = "100%";
            repeat_volume = "medium";
        }
        Object.assign(sessionAttributes,
            {
                break:1,
                rate:repeat_rate,
                volume: repeat_volume,
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        output = switchVoice(output,handlerInput.attributesManager.getSessionAttributes());
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();

    },
};

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
        let output = requestAttributes.t("WELCOME",requestAttributes.t("SKILL_NAME"),requestAttributes.t("INITIAL_LANGUAGE"))+retrieve_Strings("help",requestAttributes.t("INITIAL_LANGUAGE"),"launch");//requestAttributes.t("HELP_LAUNCH");
        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "Launch",
                voice: requestAttributes.t("NATIVE_VOICE"),
                learning_language: "none",
                native_language: requestAttributes.t("INITIAL_LANGUAGE"),
                break: 0,
                rate: "100%",
                volume: "medium",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        output = switchVoice(output,handlerInput.attributesManager.getSessionAttributes());

        return handlerInput.responseBuilder    
            .withShouldEndSession(false)
            .speak(output) //normal call.
            .getResponse();
    },
};

/**
 * Intent must deal with the intent of the user to view categories or subcategories..
 * - check previous category selections
 *  
 */
const ShowCategories = {    
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'ShowCategories';
    },
    handle(handlerInput)
    {   

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();  
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const slots = handlerInput.requestEnvelope.request.intent.slots;

        
        let category = slots['category'].value;
        let option = slots['option'].value;
        let output="";
        if (sessionAttributes.learning_language == "none")
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");//requestAttributes.t("NO_LEARNING_LANGUAGE"); 
        }
        else
        {
            if (option !=undefined)
            {//only option or category can be defined
                let info;
                if (option.toUpperCase() == "index".toUpperCase())
                {
                    if (sessionAttributes.category == undefined )
                        option = "categories";
                    else
                        option = "subcategories";
                }
                if (sessionAttributes.category != undefined) //in case the user request subcategory list without selecting previously the category. requesting and selecting at the same time.
                    category = sessionAttributes.category;
               
                if (option.toUpperCase() == "categories".toUpperCase() || option.toUpperCase() =="category".toUpperCase())
                    info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
                else if (option.toUpperCase() == "subcategories".toUpperCase() || option == "subcategory".toUpperCase())
                {
                    if (sessionAttributes.category == undefined)
                    {
                        output+= retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");//requestAttributes.t("NO_CATEGORY")+requestAttributes.t("SUGGESTED_EXAMPLE");
                    }
                    else
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                }

                if (info != null)
                {//info has value of a category or subcategory.
                    if (option.toUpperCase() == "categories".toUpperCase() || option.toUpperCase()=="category".toUpperCase())
                    {//value for all categories. showing category TITLE.
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list");//requestAttributes.t("CATEGORIES_LIST");
                        for (let i=0;i<info.length; i++)
                        {
                            output+=", "+languageProvider(sessionAttributes.native_language,info[i],"category");
                        }
                    }
                    else
                    {//value for subcategories. showing subcategory list..
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+sessionAttributes.category;//requestAttributes.t("SUBCATEGORIES_LIST",sessionAttributes.category);
                        for (let i=0;i<languageProvider(sessionAttributes.native_language,info,"subcategory").length;i++)
                        {
                            output+= ", "+languageProvider(sessionAttributes.native_language,info,"subcategory")[i].replace(","," and")+" ";
                        }
                    }
                }
            }
            else
            {//category given by user. so view subcategories..
                let info = getInfo(requestAttributes,sessionAttributes,category,undefined,0,false);
                if (info == undefined || info ==null)
                {
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                    category = undefined; 
                }
                else
                {
                    output+= retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+category;//requestAttributes.t("SUBCATEGORIES_LIST",category);
                    
                    for (let i=0;i<languageProvider(sessionAttributes.native_language,info,"subcategory").length;i++)
                    {
                        output+= ", "+languageProvider(sessionAttributes.native_language,info,"subcategory")[i].replace(","," and")+" ";
                    }
                }
            }
        }
        
        
        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "ShowCategories",
                category: category, //if undefined.. not requested..
                subcategory: "",
                break: 0,
                rate: "100%",
                volume: "medium",
                voice: retrieve_Strings("voices",sessionAttributes.native_language),//requestAttributes.t(sessionAttributes.native_language.toUpperCase()+"_VOICE"),
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse(); 
    },
};


const SelectCategoryIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'SelectCategoryIntent';
    },
    handle(handlerInput)
    {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();  
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        let category = slots['category'].value;
        let subcategory = slots['subcategory'].value;
        let random = slots['random'].value;
        let resume = slots['continue_'].value;//must chech if random enabled..
        let random_option = slots['random_option'].value;
        let output ="";

        let random_cat = false;
        let random_sub = false;
        const examples_ids = []; 
        const subcategory_ids = [];
        const category_ids = [];
        let info;
        if (resume != undefined)
        {//if enabled then change category...
            if (sessionAttributes.category == undefined)
            {//first time viewing categories..
                info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
                output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list");//requestAttributes.t("CATEGORIES_LIST");
                    for (let i=0;i<info.length; i++)
                    {
                        output+=", "+info[i].english;
                    }
                output += requestAttributes.t("FIRST_CATEGORY"," ",info[0].english);
                category = info[0].english;
                output += retrieve_Strings("general",sessionAttributes.native_language,"category_list")+category;//requestAttributes.t("SUBCATEGORIES_LIST",category);
                for (let i=0;i<info.english_sub.length;i++)
                    {
                        output+= ", "+info.english_sub[i].replace(","," and")+" ";
                    }
            }
            else
            {//random doesnt exists here.goes to the next category..
                info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,1,false);
                category = info.english;
                output += retrieve_Strings("general",sessionAttributes.native_language,"category_list")+category;//requestAttributes.t("SUBCATEGORIES_LIST",category);
                for (let i=0;i<info.learning_sub.length;i++)
                {
                    output+= ", "+info.english_sub[i].replace(","," and")+" ";
                }
                
            }
        }
        else if (random != undefined && category != undefined)
        {//user request to set to random subcategory, given category...
            info = getInfo(requestAttributes,sessionAttributes,category,undefined,0,false);
            subcategory = info.english_sub[Math.floor(Math.random()*info.english_sub.length)];
            random_sub = true;
            output += requestAttributes.t("RANDOM_SUBCATEGORY",subcategory)+requestAttributes.t("HELP_SELECT_CATEGORIES");;

        }
        else if (random!= undefined && category == undefined && random_option != undefined)
        {//to set a random category or subcategory and provide list of subcategories...
            if (random_option == "category")
            {//if to set random category
                info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
                category = info[Math.floor(Math.random()*info.length)].english;
                output+= requestAttributes.t("RANDOM_CATEGORY",category);
                output += retrieve_Strings("general",sessionAttributes.native_language,"category_list")+category;//requestAttributes.t("SUBCATEGORIES_LIST",category);
                info = getInfo(requestAttributes,sessionAttributes,category,undefined,0,false);
                for (let i=0;i<info.english_sub.length;i++)
                    {
                        output+= ", "+info.english_sub[i].replace(","," and")+" ";
                    }
                output += requestAttributes.t("HELP_SELECT_CATEGORIES");
                random_cat = true;
            }
            else if (random_option == "subcategory")
            {//to set random subcategory...
                if (sessionAttributes.category != undefined)
                {
                    info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                    category = sessionAttributes.category;
                    subcategory = info.english_sub[Math.floor(Math.random()*info.english_sub.length)];
                    output += requestAttributes.t("RANDOM_SUBCATEGORY",subcategory)+ requestAttributes.t("HELP_SELECT_CATEGORIES");
                    random_sub = true;
                }
                    
            }
        }
        else if (subcategory != undefined)
        {
            if (category != undefined)
            {//user gave category and subcategory to set up..
                output+= retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+retrieve_Strings("help",sessionAttributes.native_language,"select_categories")//requestAttributes.t("NEW_CATEGORY",category)+requestAttributes.t("NEW_SUBCATEGORY",subcategory)+requestAttributes.t("HELP_SELECT_CATEGORIES");

            }
            else
            {//user said only subcategory name, to set it..
                if (sessionAttributes.category != undefined)
                {
                    category = sessionAttributes.category;
                    output += retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+retrieve_Strings("help",sessionAttributes.native_language,"select_categories")//requestAttributes.t("NEW_CATEGORY",category)+requestAttributes.t("NEW_SUBCATEGORY",subcategory)+requestAttributes.t("HELP_SELECT_CATEGORIES");
                }
                else
                {
                    output+=  retrieve_Strings("warnings",sessionAttributes.native_language,"category");//requestAttributes.t("NO_CATEGORY");
                }
            }
        }

        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "SelectCategories",
                category: category,
                subcategory: subcategory,
                random_cat: random_cat,
                random_sub: random_sub,
                examples_ids: examples_ids,
                subcategory_ids: subcategory_ids ,
                voice: retrieve_Strings("voices",sessionAttributes.native_language),//requestAttributes.t(sessionAttributes.native_language.toUpperCase()+"_VOICE"),
                break: 0,
                rate: "100%",
                volume: "medium",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};

const ExampleIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'ExampleIntent';
    },
    handle(handlerInput)
    {   
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let resume = slots['continue'].value;
        let random = slots['random'].value;
        let output="";
        let examples_ids = [];
        let subcategory_ids = [];

        let subcategory= sessionAttributes.subcategory;


        if (sessionAttributes.category == undefined || sessionAttributes.subcategory == undefined || sessionAttributes.subcategory == "")
        {//no category or subcategory is selected.. even random must be done before this.
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");//requestAttributes.t("NO_CATEGORY")+requestAttributes.t("SUGGESTED_EXAMPLE");
        }
        else
        {
            let info;
            if (resume != undefined && random == undefined)
            {//option to move to next example. if finish of subcategory.. then next subcategory.. if finish category.. next category...
                info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,0,false);
                if (sessionAttributes.examples_ids != undefined && info.english_explanation.length > sessionAttributes.examples_ids.length )
                {//procide normally..
                    //no change in subcategory or completed the example list..
                    setExample(handlerInput,info,false);
                    if (sessionAttributes.subcategory_ids.length == 0)
                        subcategory_ids.push(0);//first subcategory defined..
                    else
                        subcategory_ids=sessionAttributes.subcategory_ids;
                    Object.assign(sessionAttributes,
                        {
                            subcategory_ids: subcategory_ids,
                        });
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    output = resume+" example of "+subcategory+". ";
                    //output = JNothing normal example.. just show the details
                }
                else
                {//index is equal to length.. change subcategory..// examples completed
                    info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                    if (sessionAttributes.subcategory_ids != undefined && sessionAttributes.subcategory_ids.length < info.english_sub.length)
                    {//safe to change to next subcategory in same category..
                            //change subcategory and provide message.. before requesting example.
                            //reset examples_ids
                        subcategory_ids = sessionAttributes.subcategory_ids;
                        subcategory_ids.push(subcategory_ids[subcategory_ids.length-1]+1);//next category..
                        Object.assign(sessionAttributes,
                            {
                                examples_ids: [],
                                subcategory_ids: subcategory_ids,
                            });
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        //setting to the next subcategory...
                        
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,1,false);
                        
                        setExample(handlerInput,info,false);
                        subcategory = info.english_title;
                        output +=requestAttributes.t("SUBCATEGORY_COMPLETED",sessionAttributes.subcategory,sessionAttributes.category)+requestAttributes.t("NEXT_SUBCATEGORY",subcategory);
                       
                    }
                    else 
                    {//last subcategory is completed.. from the start. same category..
                        //need to preset the examples and subcategory ids..
                        Object.assign(sessionAttributes,
                            {
                                examples_ids: [],
                                subcategory_ids: [],
                            });
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,1,false);
                        setExample(handlerInput,info,false);
                        subcategory = info.english_title;
                        output += requestAttributes.t("SUBCATEGORY_COMPLETED",sessionAttributes.subcategory,sessionAttributes.category)+requestAttributes.t("CATEGORY_COMPLETED",sessionAttributes.category)+requestAttributes.t("FIRST_CATEGORY","again ",sessionAttributes.category)+"and subcategory "+subcategory+". ";
                    }
                    
                }
            }
            else if (random != undefined)
            {//random enabled..
                resume = "next";
                info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,0,false);
                if (sessionAttributes.examples_ids.length < info.native_explanation.length)
                {//still available more examples that are not seen.
                    setExample(handlerInput,info,true);
                    if (sessionAttributes.subcategory_ids.length == 0)
                        subcategory_ids.push(0);//first subcategory defined..
                    else
                        subcategory_ids=sessionAttributes.subcategory_ids;
                    Object.assign(sessionAttributes,
                        {
                            subcategory_ids: subcategory_ids,
                        });
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    output = resume+" random example of "+subcategory+". ";
                }
                else
                {//index is equal to length.. change subcategory..// examples completed
                    info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                    if (sessionAttributes.subcategory_ids != undefined && sessionAttributes.subcategory_ids.length < info.english_sub.length)
                    {//safe to change to next subcategory in same category..
                            //change subcategory and provide message.. before requesting example.
                            //reset examples_ids
                        subcategory_ids = sessionAttributes.subcategory_ids;
                        subcategory_ids.push(subcategory_ids[subcategory_ids.length-1]+1);//next category..
                        Object.assign(sessionAttributes,
                            {
                                examples_ids: [],
                                subcategory_ids: subcategory_ids,
                            });
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        //setting to the next subcategory...
                        
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,1,false);
                       
                        setExample(handlerInput,info,true);
                        subcategory = info.english_title;
                        output +=requestAttributes.t("SUBCATEGORY_COMPLETED",sessionAttributes.subcategory,sessionAttributes.category)+requestAttributes.t("NEXT_SUBCATEGORY",subcategory)+resume+" example";
                       
                    }
                    else 
                    {//last subcategory is completed.. from the start. same category..
                        //need to preset the examples and subcategory ids..
                        Object.assign(sessionAttributes,
                            {
                                examples_ids: [],
                                subcategory_ids: [],
                            });
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,1,false);
                        setExample(handlerInput,info,true);
                        subcategory = info.title;
                        output += requestAttributes.t("SUBCATEGORY_COMPLETED",sessionAttributes.subcategory,sessionAttributes.category)+requestAttributes.t("CATEGORY_COMPLETED",sessionAttributes.category)+requestAttributes.t("FIRST_CATEGORY","again ",sessionAttributes.category)+resume+" example";
                    }
                    
                }
            }
            // this TODO: adjust to present learning language..
            Object.assign(sessionAttributes,
                {
                    voice: retrieve_Strings("voices",sessionAttributes.native_language),//requestAttributes.t(sessionAttributes.learning_language.toUpperCase()+"_VOICE"),
                    break: 1,
                    level: "strong",
                });
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            output += switchVoice(requestAttributes.t("NATIVE_EXPLANATION",sessionAttributes.native_explanation),sessionAttributes);
        }
        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                subcategory: subcategory,
                subcategory_ids: subcategory_ids,
                helpmsg: "ExampleIntent",
                break: 0,
                rate: "100%",
                volume: "medium",
                example_language: "spanish",
                example_type: "word",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();

    },
};

const DetailsIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'DetailsIntent';
    },
    handle(handlerInput)
    {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        
        const detail = slots['detail'].value;
        const language = slots['language'].value;
        let output ="";
        if (sessionAttributes.examples_ids != undefined && sessionAttributes.examples_ids.length>0)
        {    
            let voice,level,example_language,example_type;
            if (language != undefined)
                example_language = language;
            else
                example_language = sessionAttributes.example_language;
            if (detail.toUpperCase() == "word".toUpperCase())
            {
                if (example_language.toUpperCase() == "spanish".toUpperCase() )
                {    
                    voice = requestAttributes.t("SPANISH_VOICE");
                    example_language = "spanish";
                    output = requestAttributes.t("NATIVE_EXPLANATION",sessionAttributes.native_explanation);
                }
                else
                {
                     voice = requestAttributes.t("ENGLISH_VOICE");
                     example_language = "english";
                     output = requestAttributes.t("LEARNING_EXPLANATION",sessionAttributes.learning_explanation);
                }
                example_type="word";
                level = "strong";
            }
            else if (detail.toUpperCase() == "phrase".toUpperCase())
            {
                if (example_language.toUpperCase() == "spanish".toUpperCase())
                {    
                    voice = requestAttributes.t("SPANISH_VOICE");
                    example_language = "spanish";
                    output = requestAttributes.t("NATIVE_PHRASE",sessionAttributes.native_phrase);
                }
                else
                {
                     voice = requestAttributes.t("ENGLISH_VOICE");
                     example_language = "english";
                     output = requestAttributes.t("LEARNING_PHRASE",sessionAttributes.learning_phrase);
                }
                example_type="phrase";
                level = "strong";
            }
            else if (detail.toUpperCase() == "translation".toUpperCase())
            {
                if ((example_language.toUpperCase() == "spanish".toUpperCase() && language == undefined) || (example_language.toUpperCase() == "english".toUpperCase() && language != undefined))
                {
                    voice = requestAttributes.t("ENGLISH_VOICE");
                    example_language = "english";
                    example_type = sessionAttributes.example_type;
                    level="strong";
                    if (example_type == "phrase")
                    {
                        output = requestAttributes.t("LEARNING_PHRASE",sessionAttributes.learning_phrase);
                    }
                    else if (example_type == "word")
                    {
                        output = requestAttributes.t("LEARNING_EXPLANATION",sessionAttributes.learning_explanation);
                    }
                }
                else
                {
                    voice = requestAttributes.t("SPANISH_VOICE");
                    example_language = "spanish";
                    example_type = sessionAttributes.example_type;
                    level="strong";
                    if (example_type == "phrase")
                    {
                        output = requestAttributes.t("NATIVE_PHRASE",sessionAttributes.native_phrase);
                    }
                    else if (example_type == "word")
                    {
                        output = requestAttributes.t("NATIVE_EXPLANATION",sessionAttributes.native_explanation);
                    }
                }
            }
            else
                output = "error in details";
            
            Object.assign(sessionAttributes,
                {
                    lastmsg: output,
                    helpmsg: "DetailsIntent",
                    voice: voice,
                    break: 1,
                    rate: "100%",
                    volume: "medium",
                    example_language: example_language,
                    example_type: example_type,
                });
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }
        else
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"example");//requestAttributes.t("NO_EXAMPLE");
            Object.assign(sessionAttributes,
                {
                    lastmsg: output,
                    helpmsg: "Launch",
                    voice: retrieve_Strings("voices",sessionAttributes.native_language),//requestAttributes.t(sessionAttributes.native_language.toUpperCase()+"_VOICE"),
                    break: 0,
                    rate: "100%",
                    volume: "medium",
                    example_language: sessionAttributes.example_language,
                    example_type: sessionAttributes.example_type,
                });
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

        output = switchVoice(output,sessionAttributes);
        
    
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};

const IndexIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'IndexIntent';
    },
    handle(handlerInput)
    {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        
        const request = slots['request'].value;
        let output ="";
        if (sessionAttributes.category != undefined && request == "current category")
        {    
           output = request+" is "+sessionAttributes.category;
           
        }
        else if (sessionAttributes.subcategory != undefined && request == "current subcategory")
        {
            output = request+" is "+sessionAttributes.subcategory;
        }
        else if (sessionAttributes.examples_ids != undefined && request == "current example")
        {
            if (sessionAttributes.examples_ids.length>0)
                output = request+" is "+sessionAttributes.native_explanation;
            else
                output = retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");//requestAttributes.t("MISSING_INFO");
        }
        else if (sessionAttributes.learning_language != undefined && (request == "learning language"))
        {
            output = request + " is "+sessionAttributes.learning_language;
        }
        else if (sessionAttributes.native_language != undefined && (request == "native language" || request == "mother language"))
        {
            output = request + " is "+sessionAttributes.native_language;
        }
        else if (request == "language list")
        {
            output = retrieve_Strings("language",sessionAttributes.native_language,"list");//requestAttributes.t("LANGUAGE_LIST");
        }
        else if (request == "category list" )
            output = "TODO to show caregories here. ";
        else //if (sessionAttributes.language)
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");//requestAttributes.t("MISSING_INFO");

        Object.assign(sessionAttributes,
            {
                lastmsg: output,
                helpmsg: "IndexIntent",
                voice: retrieve_Strings("voices",sessionAttributes.native_language),//requestAttributes.t(sessionAttributes.native_language.toUpperCase()+"_VOICE"),
                break: 0,
                rate: "100%",
                volume: "medium",
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
};


const LanguageSelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'LanguageSelectionIntent';
    },
    handle(handlerInput)
    {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const language = slots['language'].value;
        const type = slots['language_type'].value;
        let output = "";
        let native=sessionAttributes.native_language;
        let learning= sessionAttributes.learning_language;
        let reset = false;
        if (language != undefined && type !=undefined)
        {
            if (type.toUpperCase() == "native".toUpperCase() || type.toUpperCase() == "mother".toUpperCase())
            {
                if (language.toUpperCase() == native.toUpperCase())
                    output = "Native language is already set to: "+language+". ";
                else if (language.toUpperCase() == learning.toUpperCase())
                    output = "Can not select "+language+" for learning and native. ";
                else
                {
                    output = "Native language changed to: "+language+". ";
                    native = language;
                }
            }
            else if (type.toUpperCase() == "teaching".toUpperCase() || type.toUpperCase() == "second".toUpperCase() || type.toUpperCase() == "learning".toUpperCase())
            {   
                if (language.toUpperCase() == learning.toUpperCase())
                    output = "Learning language is already set to: "+language+". ";
                else if (language.toUpperCase() == native.toUpperCase())
                    output = "Can not select "+language+" for learning and native. ";
                else
                {
                    output = "Learning language changed to: "+language+". ";
                    learning = language;
                    reset = true;
                }
            }
            else
                output = "nada";
        }
        else if (type == undefined && language!= undefined)
        {//learn "language", set learning language to this
            if(language.toUpperCase() == learning.toUpperCase())
                output = "Learning language is already set to :"+language+". ";
            else if (language.toUpperCase() == native.toUpperCase())
            {
                output = "Can not select "+language+" for learning and native. ";
            }
            else
            {
                output = "Learning language changed to: "+language+". ";
                learning = language;
                reset = true;
            }
            //changes learning language only.
        }
        else
            output= "Something wrong here.";

        Object.assign(sessionAttributes,
            {
                native_language: native,
                learning_language: learning,
                lastmsg: output,
                helpmsg: "LanguageSelection",
                voice: retrieve_Strings("voices",native),//requestAttributes.t(native.toUpperCase()+"_VOICE"),
                break: 0,
                rate: "100%",
                volume: "medium",
                reset: reset,
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
            output+= "categories and subcategories are reset. ";
        }

        output = switchVoice(output+retrieve_Strings("language",native,"selection")+retrieve_Strings("translation",native,learning.toUpperCase())/* requestAttributes.t("LANGUAGE_SELECTION_INFO",native,learning) */,sessionAttributes);
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse(); 
    }
} ;

//INTENTS declarations

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    //ExampleIntent,
    SessionEndedRequest,
    HelpIntent,
    CancelAndStopIntentHandler,
    FallbackHandler,
    ShowCategories,
    RepeatMessageIntent,
    //SelectCategoryIntent,
    //DetailsIntent,
    IndexIntent,
    LanguageSelectionIntent,
  ) 
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();


// USER DEFINED FUNCTIONS



function setExample(handlerInput,subcategory_info,random)
{
    
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    //return getSubcategory(handlerInput,category,sub);
    
    //debuging
    Object.assign(sessionAttributes,
        {
            debug:"in setExample before getSubcategory",
        });
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    let rnd_example;
    let exit="false";
    let examples_shown=[];
    let debug;
    //To find the examples not shown yet.
    if (random == true)
    {
        if (sessionAttributes.examples_ids !=undefined && sessionAttributes.examples_ids.length>0 && sessionAttributes.examples_ids.length < subcategory_info.native_explanation.length)
        {    
            do
            {
                rnd_example = Math.floor(Math.random()*subcategory_info.native_explanation.length);
                
                for (let i=0;i<sessionAttributes.examples_ids.length;i++)
                {
                    if (sessionAttributes.examples_ids[i] == rnd_example)
                    {
                        exit="false";
                        break;
                    }
                    else
                        exit="true";
                }

            } while (exit=="false");
            examples_shown = sessionAttributes.examples_ids;
            examples_shown.push(rnd_example);
            debug = "after do while: "+examples_shown.length;
        }
        else if (sessionAttributes.examples_ids == undefined || sessionAttributes.examples_ids.length==0)
        {
            rnd_example = Math.floor(Math.random()*subcategory_info.native_explanation.length);
            examples_shown.push(rnd_example);
            debug = "not in do while.. first time";
        }
    }
    else
    {//just the next.. (all checks for end of subcategory is done before this.)
        examples_shown = sessionAttributes.examples_ids;
        if (examples_shown.length == 0)
            examples_shown.push(0);//first example..
        else
            examples_shown.push(examples_shown[examples_shown.length-1]+1);//next index..
    }
    
    Object.assign(sessionAttributes,
        {
            native_explanation: subcategory_info.english_explanation[examples_shown[examples_shown.length-1]],
            learning_explanation: subcategory_info.spanish_explanation[examples_shown[examples_shown.length-1]],
            native_phrase: subcategory_info.english_phrase[examples_shown[examples_shown.length-1]],
            learning_phrase: subcategory_info.spanish_phrase[examples_shown[examples_shown.length-1]],
            examples_ids: examples_shown,
            debug2: debug,
        });
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    
}

/**
 * 
 * @param {*} requestAttributes  for getting from json content file
 * @param {*} category if defined provide info inside that category
 * @param {*} subcategory if defined search for subcategory and show info of that subcategory
 */
function getInfo(requestAttributes,sessionAttributes,category,subcategory,move)
{
    let categories_info = content_categories_info;//requestAttributes.t('CATEGORIES_INFO');

   
    if (subcategory != undefined)
    {//subcategory defined. inside "category" info.
        for (let i=0; i<categories_info.length; i++)
        {
            if (category!= undefined && (category.toUpperCase() == languageProvider(sessionAttributes.native_language,categories_info[i],"category").toUpperCase() || category.toUpperCase() == languageProvider(sessionAttributes.learning_language,categories_info[i],"category").toUpperCase()) )
            {
                for (let j=0; j<languageProvider(sessionAttributes.native_language,categories_info[i],"subcategory").length; j++)
                {
                    if (subcategory != undefined && (( subcategory.toUpperCase() == languageProvider(sessionAttributes.native_language,categories_info[i],"subcategory")[j].toUpperCase() || subcategory.toUpperCase() == languageProvider(sessionAttributes.native_language,categories_info[i],"subcategory")[j].replace(","," and").toUpperCase())  ||  subcategory.toUpperCase() == languageProvider(sessionAttributes.learning_language,categories_info[i],"subcategory")[j].toUpperCase() || subcategory.toUpperCase() == languageProvider(sessionAttributes.learning_language,categories_info[i],"subcategory")[j].replace(","," and").toUpperCase()) )
                    {//subcategory found in categories info...
                        let category_info = requestAttributes.t(languageProvider(sessionAttributes.native_language,categories_info[i],"category").toUpperCase().split(" ").join("_"));
                        for (let k=0;k<category_info.length; k++)
                        {//array of subcategories inside category..
                            if ( (languageProvider(sessionAttributes.native_language,category_info[k],"title").toUpperCase() == subcategory.toUpperCase() || languageProvider(sessionAttributes.native_language,category_info[k],"title").replace(","," and").toUpperCase() == subcategory.toUpperCase()) || (languageProvider(sessionAttributes.learning_language,category_info[k],"title").toUpperCase() == subcategory.toUpperCase() || languageProvider(sessionAttributes.learning_language,category_info[k],"title").replace(","," and").toUpperCase() == subcategory.toUpperCase()))
                            {
                                let l;
                                if (move != undefined && move == 1)
                                {
                                    if (k+1<category_info.length)
                                        l=k+1;
                                    else
                                        l=0;
                                }
                                else 
                                    l=k;
                                return category_info[l];
                            }
                        }

                    }
                }
            }
            else if (category == undefined)//category not given...
                return "null";//null; // no info can be gathered. inssueficient number of params
            
        }
    }
    else if (category != undefined && subcategory == undefined)
    {//subcategory not defined.. and category defined..
        for (let i=0; i<categories_info.length; i++)
        {
            if (category.toUpperCase() == languageProvider(sessionAttributes.native_language,categories_info[i],"category").toUpperCase() || category.toUpperCase() == languageProvider(sessionAttributes.learning_language,categories_info[i],"category").toUpperCase())
                {
                    let j;
                    if (move != undefined && move == 1)
                    {
                        if (i+1<categories_info.length)
                            j=i+1;
                        else
                            j=0;
                    }
                    else 
                        j=i;
                    return categories_info[j];
                }            
        }
    }
    else if (category == undefined && subcategory == undefined)
        return categories_info;
}

function switchVoice(text,sessionAttributes) {
    if (text){
        return "<voice name = '"+sessionAttributes.voice +"'><break time='"+sessionAttributes.break+"s'/><prosody rate='"+sessionAttributes.rate+"' volume='"+sessionAttributes.volume+"'>"+text+"</prosody></voice>"    
        /* if (sessionAttributes.rate == "")
        {
            return "<voice name = '"+sessionAttributes.voice +"'><break time='"+sessionAttributes.break+"s'/>"+text+"</voice>" 
        }
        else
        {
            return "<voice name = '"+sessionAttributes.voice +"'><break time='"+sessionAttributes.break+"s'/><prosody rate='"+sessionAttributes.rate+"'>"+text+"</prosody></voice>" 
        } */
    }
  }

  /**
   * 
   * @param {*} info language content
   * @param {*} option category | subcategory | example | word | phrase
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
    else if (option == "explanation")
    {
        switch(language.toUpperCase())
        {
            case "ENGLISH":
                return info.english_explanation;
            case "SPANISH":
                return info.spanish_explanation;
            case "GERMAN":
                return info.german_explanation;
            case "FRENCH":
                return info.french_explanation;
            case "ITALIAN":
                return info.italian_explanation;
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
}

/**
 * goes in language_strings content files and retrieves appropriate message string to show to user.
 * 
 */
function retrieve_Strings(string_category,language,type)
{
    let retriever;
    switch(string_category)
    {
        case "voices":
        {
            retriever = content_language_strings.VOICES;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                    return retriever[i].voice;
            }
        }
        case "general":
        {
            retriever = content_language_strings.GENERAL_STRINGS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
                    {
                        case "options": 
                            return retriever[i].options;
                    }
                    switch(type)
                    {
                        case "suggested":
                            return retriever[i].suggested_example;
                    }
                    switch(type)
                    {
                        case "category_list": 
                            return retriever[i].category_list;
                    }
                    switch(type)
                    {
                        case "subcategory_list":
                            return retriever[i].subcategory_list;
                    }
                    switch(type)
                    {
                        case "new_category":
                            return retriever[i].new_category;
                    }
                    switch(type)
                    {
                        case "new_subcategory":
                            return retriever[i].new_subcategory;
                    }
                }
            }
        }
        case "help":
        {
            retriever = content_language_strings.HELP_STRINGS;
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
            retriever = content_language_strings.OPTION_STRINGS;
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
            retriever = content_language_strings.WARNING_STRINGS;
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
                    }
                }
            }
        }
        case "language":
        {
            retriever = content_language_strings.LANGUAGE_STRINGS;
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
            retriever = content_language_strings.LANGUAGE_TRANSLATIONS;
            for (let i=0;i<retriever.length; i++)
            {
                if (retriever[i].language.toUpperCase() == language.toUpperCase())
                {
                    switch(type)
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

                    }
                }
            }
        }     
    }
}
/* 
  function switchVoice(text,voice_name,pause,level) {
    if (text){
        return "<voice name = '"+voice_name +"'><break time='"+pause+"s'/><emphasis level='"+level+"'>"+text+"</emphasis></voice>" 
        
    }
  } */
/* Core Libraries for Skill */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

/* Custom Consts */
const volume_levels = ['silent','x-soft','soft','medium','loud','x-loud']; //used to adjuste the sound volume 
const rate_levels = ['40%','50%','60%','75%','90%','100%','120%','150%','200%']; // used to adjust the speech speed
const content = require('./content');
const content_language_strings = require('./language_strings').CONTENT;
const editor_translations = require('./editor_options').CONTENT;
const content_categories_info =  content.CONTENT.CATEGORIES_INFO;

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
            EXISTENTIAL_NOTIONS: content.CONTENT.EXISTENTIAL_NOTIONS,
            QUANTITATIVE: content.CONTENT.QUANTITATIVE,
            SKILL_NAME: 'Lexicon',
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            },
    },
    'es-ES':{
        translation: {
            INITIAL_LANGUAGE: "español",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "spanish",
            NATIVE_VOICE: "Conchita",
            SKILL_NAME: 'Lexicon',
            EXISTENTIAL_NOTIONS: content.CONTENT.EXISTENTIAL_NOTIONS,
            QUANTITATIVE: content.CONTENT.QUANTITATIVE,
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            },
    },
    'it-IT':{
        translation: {
            INITIAL_LANGUAGE: "italiano",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "italian",
            NATIVE_VOICE: "Giorgio",
            SKILL_NAME: 'Lexicon',
            EXISTENTIAL_NOTIONS: content.CONTENT.EXISTENTIAL_NOTIONS,
            QUANTITATIVE: content.CONTENT.QUANTITATIVE,
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            },
    },
    'fr-FR':{
        translation: {
            INITIAL_LANGUAGE: "Français",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "french",
            NATIVE_VOICE: "Celine",
            SKILL_NAME: 'Lexicon',
            EXISTENTIAL_NOTIONS: content.CONTENT.EXISTENTIAL_NOTIONS,
            QUANTITATIVE: content.CONTENT.QUANTITATIVE,
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            },
    },
    'de-DE':{
        translation: {
            INITIAL_LANGUAGE: "Deutsche",//language of alexa
            INITIAL_LANGUAGE_ENGLISH: "german",
            NATIVE_VOICE: "Marlene",
            SKILL_NAME: 'Lexicon',
            EXISTENTIAL_NOTIONS: content.CONTENT.EXISTENTIAL_NOTIONS,
            QUANTITATIVE: content.CONTENT.QUANTITATIVE,
            WELCOME: 'Welcome to %s. I am going to teach you Vocabulary in different languages. Native Language is set to %s. ',
            },
    },
  };


// INTENTS

/**Temp test intent to handle all requests for changing categories and subcategories */
const UserSelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'UserSelectionIntent';
    },
    handle(handlerInput)
    {   
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        const option = slots['option_selection'].value;
        const random = slots['random'].value;
        let category = sessionAttributes.category;
        let subcategory = sessionAttributes.subcategory;
        var output="";
//TODO: check for languages and messages
        if (random != undefined)
        {//random option enabled.
            //case when random triggered or user said random category
            if (sessionAttributes.category == undefined || (option != undefined  && option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"category").toUpperCase()))
            {//randomizing categories
                const category_list = createReturnList('category',sessionAttributes,retrieveFromJson(),"native");
                category = category_list[Math.floor(Math.random()*category_list.length)];
                output+= "category set to "+category;
            }
            else if (sessionAttributes.category != undefined || (option != undefined && option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"subcategory").toUpperCase() && sessionAttributes.category != undefined))
            {//randomizing subcategories
                const category_section = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes.category),"native");
                subcategory = category_section[Math.floor(Math.random()*category_section.length)];
                output += "subcategory set to" + subcategory;
            }
        }
        return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(output)
        .getResponse();
    }
}

const UserCategorySelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'UserCategorySelectionIntent';
    },
    handle(handlerInput)
    {   
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        //the value of query_response should be a category name
        const query_response = slots['query'].value;
        
        var out = "";
        const category_list = createReturnList('category',sessionAttributes,retrieveFromJson(),"all");//getInfo2(requestAttributes,sessionAttributes,undefined,undefined,0));
        const position = infoFound(query_response,category_list);
        if (position!="false")
        {
            out+= 'category selected:'+category_list[position];
        }
        else
            out+= 'category not found, repeat again please';
        
        Object.assign(sessionAttributes,
        {
           category:query_response, 
           test: 'test'
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return handlerInput.responseBuilder 
        .withShouldEndSession(false)
        .speak(""+out+"category changed?:"+sessionAttributes.category)
        .getResponse();
    }
}
function retrieveFromJson(category = undefined,subcategory = undefined)
{
    if (category == undefined)
    {//return the categories info section for all categories
        //categories info is static sectino in all json vocabulary files created
        return skill_files.content().CATEGORIES_INFO;
    }
    else if(category!= undefined && subcategory == undefined)
    {//category given, must retrieve the category section.
        const keys = Object.keys(skill_files.content());
        //to skip the categories_info section 
        for (var i=1; i<keys.length; i++)
            if (keys[i].toUpperCase() == category.toUpperCase().split(" ").join("_"))
            {//found here
                return Object.values(skill_files.content())[i];
            }
        return 'false';
    }
    /* else if (category != undefined && subcategory != undefined)
    {//category given and subcategory. to retrieve a part of the category section
        const keys = Object.keys(skill_files.content());
        //to skip the categories_info section 
        for (var i=1; i<keys.length; i++)
            if (keys[i].toUpperCase() == category.toUpperCase().split(" ").join("_"))
            {//found here
                const  Object.values(skill_files.content())[i];
            }
        return 'false';
    } */
    else
        return 'false';
}


function infoFound(query_response, category_list)
{
    for (var i=0; i<category_list.length/2; i++)
    {
        if (category_list[i].toUpperCase() == query_response.toUpperCase()
            || category_list[category_list.length/2+i].toUpperCase() == query_response.toUpperCase())
            return category_list[i].toUpperCase() == query_response.toUpperCase() ? i : category_list.length/2+i;
    }
    return 'false';
}
function createReturnList(option,sessionAttributes,section_info,return_option)
{
    //2 languages to check in the categories info list.
    const learning_language = sessionAttributes.learning_language;
    const native_language = sessionAttributes.native_language;

    if (section_info != 'false')
    {//successfully retrieved the section info
        var learning_list = [section_info.length];
        var native_list = [section_info.length];
        //get the categories info section from json.
        if (learning_language != undefined && native_language != undefined)
        {   
            for (var i=0; i < section_info.length; i++)
            {
                const learning_title = languageProvider(learning_language,section_info[i],option);
                const native_title = languageProvider(native_language,section_info[i],option);
                if (native_title)//adding to native array
                {
                    native_list[i]=removeSSML(native_title);
                }
                if (learning_title)//adding to native array
                {
                    learning_list[i]=removeSSML(learning_title);
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
    return 'false';
}

function removeSSML(ssmltext)
{
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

const UserSubcategorySelectionIntent = {
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'UserSubcategorySelectionIntent';
    },
    handle(handlerInput)
    {   
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        var out="";
        const query_response = slots['query'].value;
        //check for category to be defined first
        if (sessionAttributes.category)
        {
            const subcategory_list = createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes.category),"all");//getInfo2(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0));
            const position = infoFound(query_response,subcategory_list);
            if (position!="false")
            {
                out+= 'subcategory selected:'+subcategory_list[position];
            }
            else
                out+= 'subcategory not found, repeat again please';
        }
        else
            out+='category not configured';
        
        
        return handlerInput.responseBuilder 
        .withShouldEndSession(false)
        .speak(""+out)
        .getResponse();
    }
}
const ShowCategoriesIntent ={
    canHandle(handlerInput)
    {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'ShowCategoriesIntent';
    },
    handle(handlerInput)
    { 
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
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
                    || option.toUpperCase() ==  checkEditor("option_list",sessionAttributes.learning_language,"categories").toUpperCase())
                {//user requested to display all categories available
                    section =  createReturnList('category',sessionAttributes,retrieveFromJson(),"native");
                    if (section != 'false')// check if section list retrieved without errors
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+ ". "+section;
                    else 
                        output += retrieve_Strings("warnings",sessionAttributes.native_language,"content_error");
                }
                else if (option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"subcategories").toUpperCase()
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.learning_language,"subcategories").toUpperCase())
                {//user requested to display all subcategories available
                    //category must be selected first for this
                    if (sessionAttributes.category == undefined)
                    {//no category is selected
                        output+= retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");
                    }
                    else
                    {//category is set before
                        section= createReturnList('title',sessionAttributes,retrieveFromJson(sessionAttributes.category),"native");
                        if (section != 'false') // check if section list retrieved without errors
                            output+= retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+sessionAttributes.category+ ". "+section;
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
            helpmesg: "ShowCategories",
            break: 0,
            //rate: "100%",
            volume: "medium",
            voice: retrieve_Strings("voices",sessionAttributes.native_language),
        });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse(); 
    }
}
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

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
    
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
       /*  
        let speakOutput = requestAttributes.t('HELP_START'); 
        handlerInput.attributesManager.setSessionAttributes(speakOutput); */
        
        let helpmsg;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let options = slots['help_options'].value;
        if (options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.native_language,"help").toUpperCase() || options.toUpperCase() == checkEditor("help_options_list",sessionAttributes.learning_language,"help").toUpperCase())
        { //to show help messages.
            if (sessionAttributes.helpmsg == "Launch")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"launch");
            }
            else if (sessionAttributes.helpmsg == "ShowCategories")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"show_categories");
            }
            else if (sessionAttributes.helpmsg == "SelectCategories")
            {
                helpmsg= retrieve_Strings("help",sessionAttributes.native_language,"select_categories");
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
            else if (sessionAttributes.helpmsg == "ShowCategories")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"show_categories");
            }
            else if (sessionAttributes.helpmsg == "SelectCategories")
            {
                helpmsg= retrieve_Strings("options",sessionAttributes.native_language,"select_categories");
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
                else
                    helpmsg = retrieve_Strings("options",sessionAttributes.native_language,"index");
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
                rate: "100%",
                volume: "medium",
                voice: retrieve_Strings("voices",sessionAttributes.native_language,false),
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
  
      return handlerInput.responseBuilder
      .withShouldEndSession(true)
        .speak("CANCEL AND STOP MESSAGE")
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
        /* var keys= Object.keys(test_re);
        var out ='t';
        for (var i=0;i<keys.length ;i++)
            out+= i+','+keys[i]+'.'; */
        /* var keys = Object.keys(handlerInput)
        return handlerInput.responseBuilder    
            .withShouldEndSession(false)
            .speak(out) //normal call.
            .getResponse(); */
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let output = requestAttributes.t("WELCOME",requestAttributes.t("SKILL_NAME"),requestAttributes.t("INITIAL_LANGUAGE"))+retrieve_Strings("help",requestAttributes.t("INITIAL_LANGUAGE"),"launch");
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
        
        output = switchVoice(output,handlerInput.attributesManager.getSessionAttributes());

        return handlerInput.responseBuilder    
            .withShouldEndSession(false)
            .speak(output) //normal call.
            .getResponse();
    },
};

/**
 * Custom Intent that shows when requested the categories list or subcategories list
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
                if (sessionAttributes.category != undefined) //in case the user request subcategory list without selecting previously the category. requesting and selecting at the same time.
                    category = sessionAttributes.category;
               
                if (option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"categories").toUpperCase() 
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.learning_language,"categories").toUpperCase())
                {//user request to see the catery list
                      info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
                }
                else if (option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"subcategories").toUpperCase()
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.learning_language,"subcategories").toUpperCase())
                {//user request to see the subcategory list
                    if (sessionAttributes.category == undefined)
                    {//no category is selected
                        output+= retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");
                    }
                    else
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                }
                else//given in different language
                    output+= retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");

                if (info != null)
                {//info has value of a category or subcategory.
                    if (option.toUpperCase() == checkEditor("option_list",sessionAttributes.native_language,"categories").toUpperCase()
                    || option.toUpperCase() == checkEditor("option_list",sessionAttributes.learning_language,"categories").toUpperCase())
                    {//value for all categories. showing category TITLE.
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+ ". ";
                        for (let i=0;i<info.length; i++)
                        {
                            output+=", "+languageProvider(sessionAttributes.native_language,info[i],"category");
                        }
                    }
                    else
                    {//value for subcategories. showing subcategory list..
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+sessionAttributes.category+ ". ";
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
                {//given in different language
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                    category = undefined; 
                }
                else
                {//a subcategory of previously selected category is given
                    output+= retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+category+" . ";
                    
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
                break: 0,
                rate: "100%",
                volume: "medium",
                voice: retrieve_Strings("voices",sessionAttributes.native_language),
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse(); 
    },
};

/**
 * Custom Intent to select a category or a subcategory
 * User enters the category name or subcategory name or a random option for both
 */
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
        let resume = slots['continue_'].value;
        let random_option = slots['random_option'].value;
        let output ="";
        let random_cat = false;
        let random_sub = false;
        const examples_ids = []; 
        const subcategory_ids = [];
        const category_ids = [];
        // if learning language selected doesn't show anything here..
        if (sessionAttributes.learning_language == "none")
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"no_learning_lang");
        }
        else
        {
            let info;
            if (resume != undefined)
            {//if enabled then change category...
                if (resume.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.native_language,"next_category").toUpperCase() 
                    || resume.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.learning_language,"next_category").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.native_language,"another_category").toUpperCase() 
                    || resume.toUpperCase() == checkEditor("continue_in_cat_list",sessionAttributes.learning_language,"another_category").toUpperCase())
                {
                    if (sessionAttributes.category == undefined)
                    {//first time viewing categories..
                        info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
                        output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+". ";
                        
                        for (let i=0;i<info.length; i++)
                        {
                            output+=", "+languageProvider(sessionAttributes.native_language,info[i],"category");
                        }
                        output += ". "+retrieve_Strings("general",sessionAttributes.native_language,"new_category")+languageProvider(sessionAttributes.native_language,info[0],"category")+". ";
                        category = languageProvider(sessionAttributes.native_language,info[0],"category");
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+category+". ";
                        for (let i=0;i<languageProvider(sessionAttributes.native_language,info[0],"subcategory").length;i++)
                            {
                                output+= ", "+languageProvider(sessionAttributes.native_language,info[0],"subcategory")[i].replace(","," and")+" ";
                            }
                    }
                    else
                    {//random doesnt exists here.goes to the next category..
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,1,false);
                        category = languageProvider(sessionAttributes.native_language,info,"category");
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+category+". ";
                        for (let i=0;i<languageProvider(sessionAttributes.native_language,info,"subcategory").length;i++)
                        {
                            output+= ", "+languageProvider(sessionAttributes.native_language,info,"subcategory")[i].replace(","," and")+" ";
                        }
                        
                    }
                }
                else
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request"); 
                
            }
            else if (random != undefined && category != undefined) //check for category in correct languages..
            {//user request to set to random subcategory, given category...
                if ( random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"shuffle").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"shuffle").toUpperCase())
                {
                    info = getInfo(requestAttributes,sessionAttributes,category,undefined,0,false);
                    if (info == undefined || info ==null)
                    {//given in a different language
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                        category = undefined; 
                    }
                    else
                    {
                        subcategory = languageProvider(sessionAttributes.native_language,info,"subcategory")[Math.floor(Math.random()*languageProvider(sessionAttributes.native_language,info,"subcategory").length)];
                        random_sub = true;
                        output += "Random"+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+" of category "+category+". "+retrieve_Strings("help",sessionAttributes.native_language,"select_categories");
                    }
                }
                else
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
            }
            else if (random!= undefined && category == undefined && random_option != undefined)
            {//to set a random category or subcategory and provide list of subcategories...
                if ( random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"shuffle").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"shuffle").toUpperCase())
                {
                    if (random_option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"category").toUpperCase()
                    || random_option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.learning_language,"category").toUpperCase())
                    {//if to set random category
                        info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
                        category = languageProvider(sessionAttributes.native_language,info[Math.floor(Math.random()*info.length)],"category");
                        output+= "Random "+retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+". ";
                        output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_list")+category+". ";
                        info = getInfo(requestAttributes,sessionAttributes,category,undefined,0,false);
                        for (let i=0;i<languageProvider(sessionAttributes.native_language,info,"subcategory").length;i++)
                            {
                                output+= ", "+languageProvider(sessionAttributes.native_language,info,"subcategory")[i].replace(","," and")+" ";
                            }
                        output += retrieve_Strings("help",sessionAttributes.native_language,"select_categories");
                        random_cat = true;
                    }
                    else if (random_option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.native_language,"subcategory").toUpperCase()
                    || random_option.toUpperCase() == checkEditor("random_option_list",sessionAttributes.learning_language,"subcategory").toUpperCase())
                    {//to set random subcategory...
                        if (sessionAttributes.category != undefined)
                        {
                            info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                            category = sessionAttributes.category;
                            subcategory = languageProvider(sessionAttributes.native_language,info,"subcategory")[Math.floor(Math.random()*languageProvider(sessionAttributes.native_language,info,"subcategory").length)];
                            output += "Random "+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+". "+retrieve_Strings("help",sessionAttributes.native_language,"select_categories");
                            random_sub = true;
                        }
                            
                    }
                    else
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                }
                else
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");                
            }
            else if (subcategory != undefined)
            {//given subcategory
                if (category != undefined)
                {//user gave category and subcategory to set up..
                    info = getInfo(requestAttributes,sessionAttributes,category,undefined,0,false);
                    if (info == undefined || info ==null)
                    {//given in different language
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                        category = undefined;
                        subcategory = undefined; 
                    }
                    else
                    {
                        info = getInfo(requestAttributes,sessionAttributes,category,subcategory,0,false);
                        if (info == undefined || info ==null)
                        {//given in different language
                            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                            subcategory = undefined; 
                        }
                        else
                            output+= retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+". "+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+". "+retrieve_Strings("help",sessionAttributes.native_language,"select_categories");
                   }

                }
                else
                {//user said only subcategory name, to set it..

                    if (sessionAttributes.category != undefined)
                    {
                        category = sessionAttributes.category;
                        info = getInfo(requestAttributes,sessionAttributes,category,subcategory,0,false);
                        
                        if (info == undefined || info ==null)
                        {//given in different language
                            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                            subcategory = undefined; 
                        }
                        else
                            output += retrieve_Strings("general",sessionAttributes.native_language,"new_category")+category+". "+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+". "+retrieve_Strings("help",sessionAttributes.native_language,"select_categories");
                    }
                    else
                    {//no category given.
                        subcategory = undefined;
                        output+=  retrieve_Strings("warnings",sessionAttributes.native_language,"category");
                    }
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
                voice: retrieve_Strings("voices",sessionAttributes.native_language),
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let resume = slots['continue'].value;
        let random = slots['random'].value;
        let output="";
        let examples_ids = [];
        let subcategory_ids = [];
        let override = true;
        let subcategory= sessionAttributes.subcategory;


        if (sessionAttributes.category == undefined || sessionAttributes.subcategory == undefined || sessionAttributes.subcategory == "")
        {//no category or subcategory is selected.. even random must be done before this.
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"category")+retrieve_Strings("general",sessionAttributes.native_language,"suggested");
        }
        else
        {
            let info;
            if (resume != undefined && random == undefined)
            {//option to move to next example. if finish of subcategory.. then next subcategory.. if finish category.. next category...
                if (resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"another").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"another").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"next").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"next").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"start").toUpperCase()
                    || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"start").toUpperCase())
                {
                    info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,0,false);
                    if (sessionAttributes.examples_ids != undefined && languageProvider(sessionAttributes.native_language,info,"word").length > sessionAttributes.examples_ids.length )
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
                        output = resume+retrieve_Strings("general",sessionAttributes.native_language,"example")+subcategory+". ";
                    }
                    else
                    {//index is equal to length.. change subcategory..// examples completed
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                        if (sessionAttributes.subcategory_ids != undefined && sessionAttributes.subcategory_ids.length < languageProvider(sessionAttributes.native_language,info,"subcategory").length)
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
                            subcategory = languageProvider(sessionAttributes.native_language,info,"title");
                            output +=retrieve_Strings("general",sessionAttributes.native_language,"subcategory_completed")+retrieve_Strings("general",sessionAttributes.native_language,"next_subcategory")+subcategory;
                        
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
                            subcategory = languageProvider(sessionAttributes.native_language,info,"title");
                            output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_completed")+retrieve_Strings("general",sessionAttributes.native_language,"category_completed")+retrieve_Strings("general",sessionAttributes.native_language,"new_category")+sessionAttributes.category+retrieve_Strings("general",sessionAttributes.native_language,"new_subcategory")+subcategory+". ";
                        }
                        
                    }
                }
                else
                {                    
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                    override = false;
                }            
            }
            else if (random != undefined)
            {//random enabled..
                if ((random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"random").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.native_language,"shuffle").toUpperCase()
                    || random.toUpperCase() == checkEditor("random_list",sessionAttributes.learning_language,"shuffle").toUpperCase()))
                {
                    let proceed = true;
                    if (resume != undefined)
                    {
                        if (resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"another").toUpperCase()
                        || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"another").toUpperCase()
                        || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"next").toUpperCase()
                        || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"next").toUpperCase()
                        || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.native_language,"start").toUpperCase()
                        || resume.toUpperCase() == checkEditor("continue_in_sub_list",sessionAttributes.learning_language,"start").toUpperCase())
                            proceed = true;
                        else proceed = false;
                    }
                    if (proceed == true)
                    {
                        resume = checkEditor("continue_in_sub_list",sessionAttributes.native_language,"next");//"next";
                        info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,sessionAttributes.subcategory,0,false);
                        if (sessionAttributes.examples_ids.length < languageProvider(sessionAttributes.native_language,info,"word").length)
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
                            output = resume+checkEditor("random_list",sessionAttributes.native_language,"random")+retrieve_Strings("general",sessionAttributes.native_language,"example")+subcategory+". ";
                        }
                        else
                        {//index is equal to length.. change subcategory..// examples completed
                            info = getInfo(requestAttributes,sessionAttributes,sessionAttributes.category,undefined,0,false);
                            if (sessionAttributes.subcategory_ids != undefined && sessionAttributes.subcategory_ids.length < languageProvider(sessionAttributes.native_language,info,"subcategory").length)
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
                                subcategory = languageProvider(sessionAttributes.native_language,info,"title");
                                output +=retrieve_Strings("general",sessionAttributes.native_language,"subcategory_completed")+retrieve_Strings("general",sessionAttributes.native_language,"next_subcategory")+subcategory+resume+" example. ";
                            
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
                                output += retrieve_Strings("general",sessionAttributes.native_language,"subcategory_completed")+retrieve_Strings("general",sessionAttributes.native_language,"category_completed")+retrieve_Strings("general",sessionAttributes.native_language,"new_category")+sessionAttributes.category+resume+" example";
                            }
                        }
                    }
                    else
                    {
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                        override = false;
                    }
                }
                else
                {
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                    override = false;
                }
                
            }
            if (override == true)
            {//changing examples while showing the word (both languages)
                Object.assign(sessionAttributes,
                    {
                        voice: retrieve_Strings("voices",sessionAttributes.learning_language),
                        break: 1,
                        level: "strong",
                    });
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                output = output+switchVoice(sessionAttributes.learning_word,sessionAttributes);
                Object.assign(sessionAttributes,
                    {
                        voice: retrieve_Strings("voices",sessionAttributes.native_language),
                        break: 1,
                        level: "strong",
                    });
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                output = output+" "+switchVoice(sessionAttributes.native_word,sessionAttributes);
            }
            
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
            });
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        output = switchVoice(output,sessionAttributes);
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();

    },
};

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        
        const detail = slots['detail'].value;
        let language = slots['language'].value;
        let output ="";
        let language_request_english = returnSpokenLanguage(language); //language that the request was given. (in english)

        if (language !=undefined 
            && language_request_english.toUpperCase() != sessionAttributes.learning_language.toUpperCase() 
            && language_request_english.toUpperCase() != sessionAttributes.native_language.toUpperCase() 
            )
        {

            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");   
        }
        else
        {
            
            if (sessionAttributes.examples_ids != undefined && sessionAttributes.examples_ids.length>0)
            {    
                if (language == undefined)
                    language = sessionAttributes.native_language;
                
                if (language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.native_language,sessionAttributes.native_language).toUpperCase() 
                && language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.native_language,sessionAttributes.learning_language).toUpperCase()
                    && language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.native_language).toUpperCase() 
                    && language.toUpperCase() != retrieve_Strings("translation",sessionAttributes.learning_language,sessionAttributes.learning_language).toUpperCase() )
                {
                    output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request");
                }
                else
                {
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
        

        output = switchVoice(output,sessionAttributes);
        
    
        return handlerInput.responseBuilder 
            .withShouldEndSession(false)
            .speak(output)
            .getResponse();
    },
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        
        const request = slots['request'].value;
        let output ="";
        if (sessionAttributes.category != undefined && 
            request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_category").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_category").toUpperCase() )
        {//current category
           output = request+" . "+sessionAttributes.category;
        }
        else if (sessionAttributes.subcategory != undefined && 
            (request.toUpperCase() == checkEditor("request_list",sessionAttributes.native_language,"current_subcategory").toUpperCase()
            || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"current_subcategory").toUpperCase()))
        {//current subcategory
            output = request+" . "+sessionAttributes.subcategory;
        }
        else if (sessionAttributes.examples_ids != undefined && 
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
        || request.toUpperCase() == checkEditor("request_list",sessionAttributes.learning_language,"category_list").toUpperCase())
        {//show category list
            let info = getInfo(requestAttributes,sessionAttributes,undefined,undefined,0,false);
            output+= retrieve_Strings("general",sessionAttributes.native_language,"category_list")+". ";
            for (let i=0;i<info.length; i++)
            {
                output+=", "+languageProvider(sessionAttributes.native_language,info[i],"category");
            }
        }
        else //something was wrong in the selection of the user. information not available
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");

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
        
        
        output = switchVoice(output,sessionAttributes);
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

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
        
       
        
        if (language_request_english == "unidentified" || language_request_english == undefined 
            || language_request_english.toUpperCase() != native.toUpperCase()) 
        {
            output = retrieve_Strings("warnings",sessionAttributes.native_language,"different_request")+retrieve_Strings("warnings",sessionAttributes.native_language,"given_request")+retrieve_Strings("translation",sessionAttributes.native_language,language_request_english)+". ";
        }
        else
        {
            if (language != undefined && type !=undefined)
            {
                if (type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"native").toUpperCase()
                || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"native").toUpperCase()
                || type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"mother").toUpperCase()
                || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"mother").toUpperCase())
                {
                    if (native.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"native_warn")+language+". ";
                    else if (learning.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = language+retrieve_Strings("warnings",sessionAttributes.native_language,"same_selection");
                    else
                    {
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"native_selection")+language+". ";
                        native_name = language;
                        native = retrieve_Strings("translation",language,"return");
                        if (category != undefined)
                        {
                            let new_cat;

                            //to get previous category info.. and change the category name..
                            let info = getInfo(requestAttributes,sessionAttributes,category,undefined,0);
                            new_cat = languageProvider(native,info,"category");
                            if (subcategory != undefined)
                            {
                                // get previous subcategory info to change name..
                                info = getInfo(requestAttributes,sessionAttributes,category,subcategory,0);
                                subcategory = languageProvider(native,info,"title");
                            }
                            category = new_cat;
                        }
                    }
                }
                else if  (type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"teaching").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"teaching").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"second").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"second").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.native_language,"learning").toUpperCase()
                    || type.toUpperCase() == checkEditor("language_type",sessionAttributes.learning_language,"learning").toUpperCase())
                {   //request to change learning language
                    
                    if (learning.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"learning_warn")+language+". ";//same selection as before
                    else if (native.toUpperCase() == returnSpokenLanguage(retrieve_Strings("translation",language,native)).toUpperCase())
                        output = language+retrieve_Strings("warnings",sessionAttributes.native_language,"same_selection"); //both languages are the same
                    else
                    {//correct selection
                        output = retrieve_Strings("warnings",sessionAttributes.native_language,"learning_selection")+language+". ";
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
                {
                    output =  retrieve_Strings("warnings",sessionAttributes.native_language,"learning_selection")+language+". ";
                    learning_name = language;
                    learning = retrieve_Strings("translation",language,"return");
                    reset = true;
                }
                //changes learning language only.
            }
            else//something wasn't given correctly
                output= retrieve_Strings("warnings",sessionAttributes.native_language,"missing_info");
        }

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

        output = switchVoice(output+retrieve_Strings("language",native,"selection")+sessionAttributes.learning_name,sessionAttributes);
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
    ExampleIntent,
    SessionEndedRequest,
    HelpIntent,
    CancelAndStopIntentHandler,
    FallbackHandler,
    UserSelectionIntent,
    UserCategorySelectionIntent,
    UserSubcategorySelectionIntent,
    ShowCategoriesIntent,
    //ShowCategories,
    RepeatMessageIntent,
    //SelectCategoryIntent,
    DetailsIntent,
    IndexIntent,
    LanguageSelectionIntent,
  ) 
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();



// USER DEFINED FUNCTIONS
function testingFunc(handlerInput)
{
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var output="";
    console.log("test");
    const directoryPath = path.join(__dirname, 'Documents');
    fs.readdir('./',function(err,files){

        if (err) {
            Object.assign(sessionAttributes,
            {
                file_error: err,
            });
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return ;
        } 
        //listing all files using forEach
        Object.assign(sessionAttributes,
        {
           files: files, 
           found: 'sdfsdfs',
        });            
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        files.forEach(function (file) {
            // Do whatever you want to do with the file
            test_global="file";
        });
    });
    sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return output+'nop?'+sessionAttributes.found+sessionAttributes.file_error+sessionAttributes.files;
}
function handleContentFiles()
{
    var output="";
    /* var array= Object.values(path);
    output = 'size is:'+array.length+", is type of"+typeof(array); */
    /* Object.values(path).forEach(function(value)
    {
       output=value;
    }); */
    output = Object.values(path);
    output = Object.values(output);
    /* array.forEach(function(value)
    {
        output+=value+",";
    }); */
    return 'testing'+typeof(output);
}

/**
 * Given the information it sets the next example for the subcategory selected
 * @param {*} handlerInput 
 * @param {*} subcategory_info 
 * @param {*} random : wheather to set a random or next example
 */
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
        if (sessionAttributes.examples_ids !=undefined && sessionAttributes.examples_ids.length>0 && sessionAttributes.examples_ids.length < languageProvider(sessionAttributes.native_language,subcategory_info,"word").length)
        {    
            do
            {
                rnd_example = Math.floor(Math.random()*languageProvider(sessionAttributes.native_language,subcategory_info,"word").length);
                
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
            rnd_example = Math.floor(Math.random()*languageProvider(sessionAttributes.native_language,subcategory_info,"word").length);
            examples_shown.push(rnd_example);
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
            native_word: languageProvider(sessionAttributes.native_language,subcategory_info,"word")[examples_shown[examples_shown.length-1]],
            learning_word: languageProvider(sessionAttributes.learning_language,subcategory_info,"word")[examples_shown[examples_shown.length-1]],
            native_phrase: languageProvider(sessionAttributes.native_language,subcategory_info,"phrase")[examples_shown[examples_shown.length-1]],
            learning_phrase: languageProvider(sessionAttributes.learning_language,subcategory_info,"phrase")[examples_shown[examples_shown.length-1]],
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
                        //request from content file.
                        let category_info = requestAttributes.t(languageProvider("english",categories_info[i],"category").toUpperCase().split(" ").join("_"));
                        
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
                return "null";// no info can be gathered. inssueficient number of params
            
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
/**
 * This function takes a given string and sets the volume, rate and voice presented.
 * @param {} text : text given to show
 * @param {*} sessionAttributes  
 */
function switchVoice(text,sessionAttributes) {
    if (text){
        return "<voice name = '"+sessionAttributes.voice +"'><break time='"+sessionAttributes.break+"s'/><prosody rate='"+sessionAttributes.rate+"' volume='"+sessionAttributes.volume+"'>"+text+"</prosody></voice>"    
    }
  }

  /**
   * Given the language and the info parameter, this function returns the appropriate information from the content file
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
}

/**
 * Given the language and the keyword, this function checks that the keyword is given in the correct language (native or learning)
 * @param {*} keyword_category  the category of the keyword for all languages.
 * @param {*} language 
 * @param {*} type  type of keyword..
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
                retriever = editor_translations.LANGUAGE_TYPE_LIST;
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
                retriever = editor_translations.SPEED_LIST;
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
                retriever = editor_translations.VOLUME_LIST;
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
                retriever = editor_translations.HELP_OPTIONS_LIST;
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
                retriever = editor_translations.REQUEST_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "current_category":
                                return retriever[i].current_category;
                            case "current_subcategory":
                                return retriever[i].current_subcategory;
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
                        }
                }
            }
            case "details_list":
            {
                retriever = editor_translations.DETAILS_LIST;
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
                retriever = editor_translations.CONTINUE_IN_SUB_LIST;
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
                retriever = editor_translations.CONTINUE_IN_CAT_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "next_category":
                                return retriever[i].next_category;
                            case "another_category":
                                return retriever[i].another_category;
                        }
                }
            }
            case "option_list":
            {
                retriever = editor_translations.OPTION_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "categories":
                                return retriever[i].categories;
                            case "subcategories":
                                return retriever[i].subcategories;/* 
                            case "index":
                                return retriever[i].index; */
                        }
                }
            }
            case "random_option_list":
            {
                retriever = editor_translations.RANDOM_OPTION_LIST;
                for (let i=0;i<retriever.length; i++)
                {
                    if (retriever[i].language.toUpperCase() == language.toUpperCase())
                        switch(type)
                        {//given in english.. by program.
                            case "category":
                                return retriever[i].category;
                            case "subcategory":
                                return retriever[i].subcategory;
                        }
                }
            }
            case "repeat_list":
            {
                retriever = editor_translations.REPEAT_LIST;
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
                retriever = editor_translations.RANDOM_LIST;
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
    return "null";
}

/**
 * Returns the language of the request.
 * @param {} language 
 */
function returnSpokenLanguage(language)
{
    if (language == undefined)
        return undefined;
    let retriever = content_language_strings.LANGUAGE_TRANSLATIONS;
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

                        }
                    }
                }
            }
        } 
        default:
            return "nada";    
    }
}

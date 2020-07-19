module.exports = {
    CONTENT:
    {
        //this must not change..
        VOICES:
        [
            {
                language: "english",
                voice: "Kendra",
            },
            {
                language: "french",
                voice: "Celine",
            },

            {
                language: "german",
                voice: "Marlene",
            },
            {
                language: "italian",
                voice: "Carla",
            },
            {
                language: "spanish",
                voice: "Lucia",
            }
        ],
        GENERAL_STRINGS:
        [
            {
                language: "english",
                options: "Say Options to get the available commands. ",
                suggested_example: "You can say random theme. ",
                category_list: "The themes are: ",
                subcategory_list: "The topics are: ",
                new_category: "Theme selected: ",
                new_subcategory: "Say start for learning the topic selected: ",
                fallback: "Something was given wrong, please follow the instructions. See you later. ",
                category_completed: "All topics are completed. ",
                subcategory_completed: "All examples of current topic are completed. ",
                next_subcategory: "Moving to topic .",
                example: " example of .",
            },
            {
                language: "french",
                options: "Dites Options pour voir les étapes disponibles. ",
                suggested_example: "Vous pouvez dire catégorie aléatoire. ",
                category_list: "Les catégories sont : ",
                subcategory_list: "Les sous-catégories sont : ",
                new_category: "Catégorie sélectionnée : ",
                new_subcategory: "Sous-catégorie sélectionnée : ",
                fallback: "La demande n'a pas été faite correctement, Veuillez suivre les instructions. A bientôt. ",
                category_completed: "Toutes les sous-catégories sont complètes. ",
                subcategory_completed: "Tous les exemples de la sous-catégorie sélectionnée sont complets. ",
                next_subcategory: "Passons à la sous-catégorie .",
                example: " exemple ",
            },
            {
                language: "german",
                options: "Sagen Sie Optionen, um die verfügbaren Schritte zu bekommen. ",
                suggested_example: "Sie können zufällige Kategorie oder zufällige Unterkategorie sagen. ",
                category_list: "Die folgende Liste ist ein Index aller verfügbaren Kategorien. ",
                subcategory_list: "Die folgende Liste ist ein Index aller Unterkategorien der Kategorie ",
                new_category: "Kategorie ausgewählt: ",
                new_subcategory: "Unterkategorie ausgewählt: ",
                fallback: "Etwas wurde verkehrt gegeben, folgen Sie bitte den Anweisungen. Bis später. ",
                category_completed: "Alle Unterkategorien sind abgeschlossen. ",
                subcategory_completed: "Alle Beispiele der laufenden Unterkategorie sind abgeschlossen. ",
                next_subcategory: "Wechseln zur Unterkategorie .",
                example: " Beispiel ",
            },
            {
                language: "italian",
                options: "Di'Opzioni per visualizzare i passaggi disponibili. ",
                suggested_example: "Puoi dire una categoria casuale o una sottocategoria casuale. ",
                category_list: "La seguente lista è l'indice di tutte le categorie disponibili. ",
                subcategory_list: "La seguente lista è un indice di tutte le sottocategorie di questa categoria.",
                new_category: "Categoria selezionata: ",
                new_subcategory: "Sottocategoria selezionata: ",
                fallback: "Il comando è stato dato in modo incorretto, per favore, segui le istruzioni. A presto. ",
                category_completed: "Tutte le sottocategorie sono completate. ",
                subcategory_completed: "Tutti gli esempi della seguente sottocategoria sono completati. ",
                next_subcategory: "Spostamento alla sottocategoria .",
                example: " esempio di ",
            },
            {
                language: "spanish",
                options: "Di, opciones, para obtener los pasos disponibles. ",
                suggested_example: "Puedes decir, tema aleatorio. ",
                category_list: "Lo temas son: ",
                subcategory_list: "Los topics son: ",
                new_category: "Tema seleccionado: ",
                new_subcategory: "Di, empezar, para aprender el topic seleccionado: ",
                fallback: "Un comando fue dado de manera incorrecta, por favor, siga las instrucciones. Hasta luego. ",
                category_completed: "Todos los topics han sido completados. ",
                subcategory_completed: "Todos los ejemplos del topic actual han sido completados. ",
                next_subcategory: "Moviendo al topic .",
                example: "ejemplo de .",
            }
        ],
        HELP_STRINGS:
        [
            {
                language: "english",
                launch: "Select a learning language to get started. Say Help to get the available steps. ",
                show_categories: "You have to select both a category and a subcategory before preceeding . ",
                example: "Say the language and then word or phrase to get the word or example respectively. ",
                select_categories: "You can now say, start, or next, to move to the next example. Or say, random, to get a random example. ",
                details: "Say the language and then word or phrase to get the word or example respectively. ",
                resume: "Say current and theme, topic or example to relocate yourself. ",
                reset: "Language has changed, select a theme to continue. "
            },
            {
                language: "french",
                launch: "Pour commencer, sélectionnez une langue d'apprentissage. Dites Options pour obtenir plus d'information. ",
                show_categories: "Avant de procéder, vous devez sélectionner une catégorie et une sous-catégorie. ",
                example: "Dites la langue d'apprentissage puis le mot ou l'expression pour obtenir respectivement une traduction ou un exemple. ",
                select_categories: "Maintenant, vous pouvez dire commencer ou suivant pour passer à l'exemple suivant. Dites aléatoir pour obtenir un exemple aléatoir. ",
                details: "Dites votre langue d'apprentissage puis le mot ou expression pour obtenir respectivement une traduction ou un exemple. ",
                resume: "Dites catégorie actuelle, sous-catégorie ou exemple pour vous déplacer. ",
                reset: "Langue d'apprentissage modifiée. Sélectionnez une catégorie pour continuer. "
            },
            {
                language: "german",
                launch: "Wählen Sie eine Lernsprache aus, um loszulegen. Sagen Sie Optionen oder Anweisungen, um weitere Hilfe zu erhalten. ",
                show_categories: "Sie müssen vor dem Vorgeben sowohl eine Kategorie als auch eine Unterkategorie auswählen. Zufällig ist immer eine Option. ",
                example: "Sagen Sie Wort oder Mutterwort lernen, um das Wort oder den spanischen Oder englischen Satz zu erhalten, um das Beispiel zu erhalten. ",
                select_categories: "Sie können nun sagen, start oder next, um zum nächsten Beispiel zu wechseln. Oder sagen Sie zufällig, um ein zufälliges Beispiel zu erhalten. ",
                details: "Sagen Sie spanisches Wort oder englisches Wort, um das Wort oder den spanischen Ausdruck oder den englischen Ausdruck zu erhalten, um das Beispiel zu erhalten.",
                resume: "Sagen Sie Strom und Kategorie, Unterkategorie oder Beispiel, um sich selbst zu verschieben. ",
                reset: "Das Erlernen der Sprache hat sich geändert, wählen Sie kategorie aus, um fortzufahren. "
            },
            {
                language: "italian",
                launch: "Seleziona una lingua di apprendimento per iniziare. Di'opzioni o istruzioni per ricevere ulteriore aiuto. ",
                show_categories: "Devi selezionare sia una categoria che una sottocategoria prima di procedere. Casuale è sempre un'opzione. ",
                example: "Di'una parola nella lingua di apprendimento o una parola nella lingua materna per ottenere la parola o una frase in spagnolo o una frase in inglese per ottenere un esempio casuale. ",
                select_categories: "Adesso puoi dire inizio o successivo per passare all'esempio seguente. Oppure di' casuale per ottenere un esempio casuale. ",
                details: "Di' una parola in spagnolo o in inglese per ottenere la parola oppure una frase in spagnolo o in inglese per ottenere un esempio casuale.",
                resume: "Di'attuale e categoria, sottocategoria o esempio per riposizionarti. ",
                reset: "Lingua di apprendimento cambiata, seleziona una categoria per continuare. ",
            },
            {
                language: "spanish",
                launch: "Selecciona un idioma de aprendizaje para empezar. Dí, ayuda, para obtener más información. ",
                show_categories: "Tienes que seleccinar ambas, un tema y un topic antes de poder proceder. ",
                example: "Diga el idioma y luego la palabra o frase para obtener la palabra o ejemplo respectivo.",
                select_categories: "Ahora puedes decir, inicio, o, siguiente, para pasar al siguiente ejemplo. O decir, aleatorio, para obtener un ejemplo aleatorio. ",
                details: "Diga el idioma y luego la palabra o frase para obtener la palabra o ejemplo respectivo. ",
                resume: "Dí tema actual, topic actual, o, ejemplo, para rehubicarte. ",
                reset: "El idioma de aprenizaje ha cambiado, selecciona un tema para continuar. ",
            }
        ],
        OPTION_STRINGS:
        [
            {
                language: "english",
                welcome: "Say learn and the language. Say language list to get all languages available. Say change native language to and the language if you need a different native language. ",
                show_categories: "Say, show themes, or, show topics, to see list of categories or subcategories. You can use the index numbers of the categories as a shortcut to access the categories. Random is always an option. ",
                select_categories: "Say next to give next in order example. Repeat, to repeat the word, Random, to give the next random example, view current subcategory, to give the next random example and next category, to move forward. ",
                example: "Say, random, to give the next random example. Say next to give next in order example. View current example by saying view example. ",
                details: "Say the language you want to view and word or phrase. ",
                reset: "Say theme list, to get the list of available themes. Say open theme, and the theme number, to open a theme. ",
                resume: "Continue where you left of before. Say, themes, to get the list themes. ",
                index: "Say, next, or, random, to continue with the next example. Say, current topic, to get the current topic. "
            },
            {
                language: "french",
                welcome: "Dites apprendre et une langue. Dites liste des langues pour connaître toutes les langues disponibles. Dites changer la langue maternelle pour et une langue pour changer la langue maternelle. ",
                show_categories: "Dites montrer les catégories ou sous-catégories pour obtenir la liste des catégories ou sous-catégories. Vous pouvez utiliser le numéro de chapitre des catégories comme raccourci pour accéder aux catégories. Aléatoir est toujours une option. Si vous connaissez la catégorie, dites ouvrir catégorie et le nom de la catégorie. ",
                select_categories: "Dites suivant pour obtenir l'exemple suivant dans la liste. Dites aléatoir pour obtenir l'exemple aléatoir suivant. Accédez à la sous-catégorie actuelle en disant voir sous-catégorie. Dites catégorie suivante pour avancer. ",
                example: "Dites aléatoir pour obtenir l'exemple aléatoir suivant. Dites suivant pour obtenir l'exemple suivant dans la liste. Accédez à l'exemple actuel en disant voir exemple. ",
                details: "Dites la langue que vous voulez et un mot ou une expression ",
                reset: "Dites liste des catégories pour obtenir la liste des catégories disponibles. ",
                resume: "Reprenez là où vous vous êtes arrêté ou avant. Dites catégories pour obtenir la liste des catégories. ",
                index: "Dites suivant ou aléatoir pour continuer avec l'exemple suivant. Dites sous-catégorie actuelle pour obtenir la sous-catégorie actuelle. "
            },
            {
                language: "german",
                welcome: "Sagen Sie Lernen und die Sprache. Sagen Sie die Sprachliste, um alle verfügbaren Sprachen verfügbar zu machen. ",
                show_categories: "Sagen Sie anzeigen Kategorien oder Unterkategorien, um eine Liste von Kategorien oder Unterkategorien anzuzeigen. ",
                select_categories: "Sagen Sie zufällig, um das nächste zufällige Beispiel zu geben. Sagen Sie nächste, um das nächste in der Reihenfolge Beispiel zu geben. Sagen Sie Ansichtsunterkategorie um die aktuelle Unterkategorie zu anzeigen. Sagen Sie die nächste Kategorie, um voranzukommen. ",
                example: "Sagen Sie zufällig, um das nächste zufällige Beispiel zu geben. Sagen Sie als nächstes, um als nächstes in der Reihenfolge Beispiel zu geben. Zeigen Sie das aktuelle Beispiel an, indem Sie ein Ansichtsbeispiel sagen ",
                details: "Sagen Sie die Sprache, die Sie anzeigen möchten, und Wort oder Ausdruck. ",
                reset: "Angenommen, Kategorienliste, um eine Liste der verfügbaren Kategorien abrufbar zu machen. ",
                resume: "Fahren Sie dort fort, wo Sie vorher geblieben sind. Angenommen Kategorien, um die Liste abzubekommen. ",
                index: " Sagen Sie als nächstes oder zufällig, um mit dem nächsten Beispiel fortzufahren. Angenommen, aktuelle Unterkategorie, um die aktuelle Unterkategorie abzuerhalten."
            },
            {
                language: "italian",
                welcome: "Di' impara e la lingua. Di' elenco lingue per ottenere tutte le lingue disponibili. ",
                show_categories: "Dì' visualizza categorie o sottocategorie per vedere l'elenco delle categorie o sottocategorie. ",
                select_categories: "Di' casuale per accedere al successivo esempio casuale. Di' casuale per accedere all'esempio successivo in ordine. Vedi l'attuale sottocategoria dicendo vedere sottocategoria. Di' categoria successiva per proseguire. ",
                example: "Di' casuale per accedere all'esempio succesivo. Di' successivo per accedere all'esempio successivo in ordine. Vedi l'attuale esempio dicendo vedere esempio ",
                details: "Di' la lingua che vuoi visualizzare e la parola o frase. ",
                reset: "Di' lista categorie per accedere alla lista delle categorie disponibili. ",
                resume: "Continua da dove hai interrotto. Di' categorie per accedere alla lista.",
                index: "Di' successivo o casuale per continuare con l'esempio successivo. Di' categoria attuale per accedere alla categoria attuale."
            },
            {
                language: "spanish",
                welcome: "Dí, aprender, y, el idioma. Dí, lista de idiomas, para obtener todos los idiomas que hay disponibles. ",
                show_categories: "Di, mostrar temas, o, mostrar topics, para ver la lista completa de temas o topics disponibles. ",
                select_categories: "Di, aleagorio, para obtener el próximo ejemplo aleagorio. Di, próximo, para recibir el siguiente ejempl de la lista según su orden. Dí subcategría actual para ver en que subcagetoría estamos. Dí próxima categorá para cambiar a la próxima categoría. ",
                example: "Dí aleatorio para obtener el próxmo ejemplo aleatorio. Say next to give next in order example. View current example by saying view example. ",
                details: "Dí el nombre del idioma, y luego, palabra, o, frase. ",
                reset: "Dí, lista de temas, para obtener la lista de los temas disponibles. ",
                resume: "Continua desde donde lo dejaste la vez anterior. Dí, temas, para acceder a la lista de temas. ",
                index: "Dí, próximo, o, aleatorio, para continuar con el próximo ejemplo. Dí, topic actual, para obtener el topic en el que estás estudiando. "
            }
        ],
        WARNING_STRINGS:
        [
            {
                language:"english",
                category: "No theme or topic selected before. Please select both first. ",
                example: "No example selected before. Nothing to show. ",
                missing_info: "Missing some selections, can not provide that information. ",
                no_learning_lang: "You haven't selected a learning language. Say, language list, to hear to all available languages.. ",
                different_request: "Why are asking in different language? ",
                same_selection: " Can not be selected for both native and learning language. ",
                native_selection: "Native language changed to ",
                learning_selection: "Learning language change to ",
                native_warn: "Native language is already set to ",
                learning_warn: "Learning language is already set to ",
                reset: "Themes and topics are reset. Select a theme and a topic, and say, start. ",
                given_request: "Request must be given in English but received it in ",
                content_error: "Something wrong with the skill's content information. Please try again. ",
                name_not_found: " doesn't exist in my available list .",
                not_category: "You have to selected a theme first .",
                cancel_stop: "Thank you for using Lexicon, see you around. ",

            },
            {
                language:"french",
                category: "Aucune catégorie ou sous-catégorie n'a été sélectionnée. Veuillez les sélectionner avant de continuer. ",
                example: "Aucun n'exemple n'a été sélectionné. Rien à montrer. ",
                missing_info: "Il manque certaines sélections. Impossible de fournir l'information. ",
                no_learning_lang: "Aucune langue d'apprentissage sélectionnée. Dites liste des langues pour connaître les options. ",
                different_request: "Pourquoi faites-vous votre demande dans une autre langue? ",
                same_selection: " ne peut être sélectionné comme langue maternelle et langue d'apprentissage. ",
                native_selection: "Langue maternelle modifiée pour ",
                learning_selection: "Langue d'apprentissage modifiée pour ",
                native_warn: " est déjà sélectionné comme langue maternelle",
                learning_warn: " est déjà sélectionné comme langue d'apprentissage",
                reset: "Les catégories et sous-catégories ont été réinitialisées. ",
                given_request: "Les demandes doivent être faites en français. Cette demande est en ",
                content_error: "Il y a un problème avec les informations du contenu de compétence. Veuillez réessayer. ",
                name_not_found: " ne se trouve pas dans ma liste.",
                not_category: "Veuillez d'abord sélectionner une catégorie.",
                cancel_stop: "Merci d'avoir utilisé Lexicon, à bientôt. ",
            },
            {
                language:"german",
                category: "Keine Kategorie oder Unterkategorie zuvor ausgewählt. Bitte wählen Sie beide zuerst aus. ",
                example: "Kein Beispiel zuvor ausgewählt. Nichts zu zeigen. ",
                missing_info: " Wenn einige Auswahlen fehlen, können diese Informationen nicht zur Verfügung stehen.",
                no_learning_lang: "Sie haben keine Lernsprache ausgewählt. Sagen Sie sprachliste, um alle Optionen zu hören. ",
                different_request: "Warum fragen Sie in einer anderen Sprache? ",
                same_selection: "Kann nicht sowohl für muttersprachliche als auch für Lernsprache ausgewählt werden.",
                native_selection: "Muttersprache geändert, um",
                learning_selection: "Sprachwechsel zum Lernen ",
                native_warn: "Die Muttersprache ist bereits auf ",
                learning_warn: "Die Lernsprache ist bereits auf ",
                reset: "Kategorien und Unterkategorien werden zurückgesetzt. ",
                given_request: "Der Antrag muss in Deutsch gestellt werden, erhält sie aber in",
                content_error: "Etwas, das mit den Inhaltsinformationen der Fertigkeit nicht stimmt. Bitte versuchen Sie es erneut. ",
                name_not_found: " Ist in meiner verfügbaren Liste nicht vorhanden.",
                not_category: "Sie müssen eine Kategorie zu aussuchen.",
                cancel_stop: "Vielen Dank, dass Sie Lexicon verwenden. Wir sehen uns.",
            },
            {
                language:"italian",
                category: "Nessuna categoria o sottocategoria è stata selezionata in precedenza. Sei pregato di selezionare entrambe prima di procedere ",
                example: "Nessun esempio selezionato in precedenza. Niente da mostrare. ",
                missing_info: "Mancano alcune sezioni, l'informazione non può essere fornita ",
                no_learning_lang: "Non è stata selezionata una lingua di apprendimento. Di'lista di lingue per ascoltare tutte le opzioni. ",
                different_request: "Perché stai domandando in un'altra lingua? ",
                same_selection: " Non può essere selezionato né per la lingua materna né per la lingua di apprendimento. ",
                native_selection: "Lingua materna cambiata in ",
                learning_selection: "Lingua di apprendimento cambiata in",
                native_warn: "La lingua materna è già stata impostata su",
                learning_warn: "La lingua di apprendimento è già stata impostata su ",
                reset: "Categorie e sottocategorie sono state resettate ",
                given_request: "La richiesta deve essere formulata in italiano ma è stata ricebuta in ",
                content_error: "Qualcosa che non va con la creazione del contenuto. Per favore, riprova. ",
                name_not_found: " Non esiste nella mia lista disponibile .",
                not_category: "Devi prima selezionare una categoria.",
                cancel_stop: "Grazie per aver usato Lexicon, ci vediamo in giro.",
            },
            {
                language:"spanish",
                category: "No hay un tema o topic previamene seleccionado. Por favor, elija ambos primero. ",
                example: "No hay un ejemplo previamente seleccionado. No hay nada que mostrar. ",
                missing_info: "Faltan algunas selecciones, no se puede proporcionar esa información. ",
                no_learning_lang: "No has elegido un idioma para el aprendizaje. Di, lista de idiomas, para escuchar todos los idiomas disponibles. ",
                different_request: "Por que preguntas en un idioma diferente? ",
                same_selection: " No puede ser seleccionado en ambas situaciones, como idioma nativo y de estudio. ",
                native_selection: "El idioma nativo ha sido cambiado a ",
                learning_selection: "El idioma de estudio ha sido cambiado a ",
                native_warn: "El idoma nativo está configurado a ",
                learning_warn: "El idioma de estudio está configurado a ",
                reset: "Los temas y topics han sido reiniciados. Elige un tema y un topic y di, empezar.",
                given_request: "La petición debería haber sido realizada en Español, pero ha sido recibida en ",
                content_error: "Algo salió mal con la información de contenido. Por favor, inténtelo de nuevo. ",
                name_not_found: " no existe en mi lista disponible.",
                not_category: "Tienes que seleccionar una lista primero.",
                cancel_stop: "Gracias por usar Lexicon, nos vemos. ",
            }
        ],
        LANGUAGE_STRINGS:
        [
            {
                language: "english",
                list: "Languages available are English, French, German, Italian, and Spanish. ",
                selection: "Native language is English. and "
            },
            {
                language: "french",
                list: "Les langues disponibles sont anglais, espagnol, italien et allemand. ",
                selection: "La langue maternelle est le français. Et "
            },
            {
                language: "german",
                list: "Verfügbare Sprachen sind Englisch, Spanisch, Italienisch, Französisch und Deutsch.",
                selection: "Muttersprache ist Deutsch. und "
            },
            {
                language: "italian",
                list: "Le lingue disponibili sono Inglese, Spagnolo, Italiano, Francese e Tedesco. ",
                selection: "La lingua materna è l'italiano. e "
            },
            {
                language: "spanish",
                list: "Las lenguas disponibles son: Alemán, Español, Francés, Inglés e Italiano. ",
                selection: "El idioma seleccionado como nativo es Español.  Y "
            }
        ],//This must not change..
        LANGUAGE_TRANSLATIONS:
        [
            {
                language:["english","inglés","Englisch","Anglais","inglese"], // Languages of the aplication
                english: "english",
                french: "french",
                german: "german",
                italian: "italian",
                spanish: "spanish",
            },
            {
                language:["french","francés","Französisch","Français","francese"],
                french: "français",
                english: "anglais",
                german: "allemand",
                italian: "italien",
                spanish: "espagnol",
            },
            {
                language:["german","aleman","Deutsche","allemand","tedesca"],
                german: "deutsche",
                english:"englisch",
                french: "französisch",
                italian: "italienisch",
                spanish: "spanisch",
            },
            {
                language:["italian","italiano","Italienisch","italien","italiano"],
                italian: "italiano",
                english:"inglese",
                french: "francese ",
                german: "tedesca",
                spanish: "spagnolo",
            },
            {
                language:["spanish","español","spanisch","espagnol","spagnolo"],
                spanish: "español",
                english: "inglés",
                french: "francés",
                german: "aleman",
                italian: "italiano",
            },
        ],
    }
}

running = false;
p = document.getElementById("output")

function format_settings(suffix) {
    const settings = {
        async: false,
        error: function(jqXHR, exception) {
            console.log('err')
        },
        crossDomain: true,
        url: 'https://wordsapiv1.p.rapidapi.com/words/' + suffix,
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'cf73fc98c6mshc8e9bdb9c742589p10722djsn77a5914bc221',
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            
        }
    };
    return settings;
}

function metamorphize(str) {
    syn = 'placeholder'
    result = 'No further metamorphization is possible!'
    
    const settings = format_settings(str + '/synonyms')
    found = false
    
    $.ajax(settings).done(function (response) {

        console.log(response)
        response.synonyms.forEach(function(word) {
            if (word.length > str.length) {
                syn = word
                found = true
            }
        });
        if (found) {
            result = str + ' --> ' + syn 
        }
    });
    return result
}

function response(str_in) {
    var str = str_in.split(" ");
    if(str[0] == '-h' || str[0] == 'help') {
        return "List of commands:"
    } else if (str[0] == 'clear') {
        p.innerHTML = '';
        return "Terminal cleared."
    }

    if (str[0] == 'metamorphize' || str[0] == '-m') {
        if (str.length  == 2) {
            return metamorphize(str[1])
        }
    }

    return "Invalid prompt. Enter 'help' (-h) for command list"
}

async function print(isusr, str) {
    if (isusr) {
        p.innerHTML += "🌱: "
    } else {4
        p.innerHTML += "🪨: "
    }
    for (let i = 0; i < str.length; i++) {
        await new Promise(r => setTimeout(r, 5));
        p.innerHTML += str[i];
        p.scrollTop = p.scrollHeight;
    }
    p.innerHTML += '\n\n'
}

async function display(str) {
    
    document.getElementById("textar").value = ''

    await print(true, str)
    data = response(str)
    await print(false, data)
    
}

print(false, "Welcome to Geologic Language.\n\nEnter -h or 'help' for a list of commands.")

function call() {
    if (!running) { 
        str = document.getElementById("textar").value
        if (str.length > 0) {
            running = true
            display(str)
            running = false;
        }
    }
}
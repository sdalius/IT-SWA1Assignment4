export let messages = []
export function Warnings(){
    let initBol = true

    const retrieveData = (message,sevBol) =>{
        let json
        if(sevBol != true){
             json = JSON.parse(message.data)
        }
        else
            json = message

        if(initBol){
            initData(json,sevBol)
        }else {

            let element = document.getElementById(`${json.id}`)

            if (element === null) {
                addWarning(json,sevBol)
            } else {
                updateWarning(element, json,sevBol)
            }

        }
    }


    const initData = (json,sevBol) => {
        json.warnings.forEach(warning => {addWarning(warning,sevBol)})
        initBol = false
    }

    const addWarning = (text,sevBol) => {
        if(sevBol!=true){
            messages.push(text)
        }
        let severity =  document.getElementById("fname").value;
        console.log(text.severity + "sev" + severity)
        if(text.severity >= severity) {
            const li = document.createElement('li')
            li.setAttribute("id", `${text.id}`)
            li.innerText = JSON.stringify(text)
            document.querySelector('#warnings').appendChild(li)
        }
    }
    const updateWarning = (element, newData, sevBol) => {
        if(sevBol!=true){
            messages.push(newData)
        }
        let severity =  document.getElementById("fname").value;
        console.log(newData.severity + "sev" + severity)
        if(newData.severity >= severity) {
            const a = document.createElement('a')
            a.innerText = JSON.stringify(newData)
            element.appendChild(a)
        }
    }



    return {
        retrieveData,addWarning
    }

}
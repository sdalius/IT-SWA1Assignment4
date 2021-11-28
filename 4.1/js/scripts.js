let severity;
let warnings = [];
let bPaused = false;

const pause = () => { // If client presses Pause warnings, he unsubscribes from observer, and changes the button name
	const btnPause = document.getElementById("btnPauseWarnings");
    if (!bPaused)
    {
        bPaused = true;
		btnPause.innerText = "Resume warnings"
        subscription.unsubscribe();
        return;
    }
    else
        bPaused = false;
		btnPause.innerText = "Pause warnings"
        subscription = poll.subscribe();
        return;
}

const setSeverity = () => {
	const severityLevelInput = document.getElementById("severityInput").value; // Set severity from the input field
	severity = severityLevelInput
}

const displayWarnings = (warning) => { // If id is not undefined, append data to the list
	const warningsList = document.getElementById('warningList');
	if (warnings[warning.id] !== undefined) {
		warningsList.innerHTML += "<h2>What has been changed: </h2>"
		warningsList.innerHTML += "<b>Severity: " + (warning.severity - warnings[warning.id].severity) + "<br/>"
		warningsList.innerHTML += "<b>From: " + (warning.prediction.from - warnings[warning.id].prediction.from) + "<br/>"
		warningsList.innerHTML += "<b>To: " + (warning.prediction.to - warnings[warning.id].prediction.to) + "<br/>"
	}
	warnings[warning.id] = warning;
	warningsList.innerHTML += "<pre>" + JSON.stringify(warning, null, 0.1) + "</pre>"
	warningsList.innerHTML += "---------------------------------------------------"
};

const clearWarnings = () => {
	document.getElementById('warningList').innerHTML = "";
}

const makeRequest = () => rxjs.fetch.fromFetch('http://localhost:8080/warnings').pipe(
	rxjs.operators.switchMap(response => {
	if (response.ok) {
		return response.json();
	} 
	else 
	{
		return of({
			error: true,
			message: `Error ${response.status}`
			});
		}
	})
);

const poll = rxjs.of({}).pipe(
	rxjs.operators.mergeMap(_ => makeRequest()),
	rxjs.operators.tap(clearWarnings),
	rxjs.operators.mergeMap(element => element.warnings),
	rxjs.operators.filter(warnings => warnings.severity >= severity),
	rxjs.operators.tap(displayWarnings),
	rxjs.operators.delay(5000),
	rxjs.operators.repeat()
);

var subscription = poll.subscribe();
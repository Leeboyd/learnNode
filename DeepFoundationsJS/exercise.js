// **************************
// **************************
// **************************
let Helpers = {
	maxVisibleWorkDescriptionLength: 20,
	maxWorkTime: 600,
	minWorkDescriptionLength: 5,

	validateWorkEntry (description, minutes) {
		try {
			if (description.length < this.minWorkDescriptionLength) {
				throw new Error('description" must be at least 5 characters long')
			}
			if (/^s*$/.test(minutes)) {
				throw new Error('minutes" must be a non-empty value')
			}
			if (this.isNaN(minutes)) {
				throw new Error('minutes" must be a number value')
			}
			if (minutes < 0 || minutes > this.maxWorkTime) {
				throw new Error('minutes" must be a number from 0 to 600 (inclusive)')
			}		
		} catch (error) {
			if (error) return null
		}
		return true
	},

	formatWorkDescription (description) {
		if (description.length > this.maxVisibleWorkDescriptionLength) {
			description = `${description.substr(0, this.maxVisibleWorkDescriptionLength)}...`;
		}
		return description;
	},

	formatTime (time) {
		var hours = Math.floor(time / 60);
		var minutes = time % 60;
		if (hours == 0 && minutes == 0) return "";
		if (minutes < 10) minutes = `0${minutes}`;
		return `${hours}:${minutes}`;
	},

	isNaN (num) {
		return Number(num) !== Number(num) 
	}

}
// **************************
// **************************
// **************************
let UI = setupUI()
UI.init()

let App = setupApp(UI)
App.addProject("學習")
App.addProject("工作")
App.addProject("休息")
// **************************
// **************************
// **************************

function setupUI () {
	const projectTemplate = "<div class='project-entry'><h3 class='project-description' rel='js-project-description'></h3><ul class='work-entries' rel='js-work-entries'></ul><span class='work-time' rel='js-work-time'></span></div>";
	const workEntryTemplate = "<li class='work-entry'><span class='work-time' rel='js-work-time'></span><span class='work-description' rel='js-work-description'></span></li>";

	var $workEntryForm;
	var $workEntrySelectProject;
	var $workEntryDescription;
	var $workEntryTime;
	var $workEntrySubmit;
	var $totalTime;
	var $projectList;

	var projectElements = {};
	var workElements = {};

	let publicAPI = {
		init: initUI,
		addProjectToList: addProjectToList,
		addProjectSelection: addProjectSelection,
		addWorkEntryToList: addWorkEntryToList,
		updateProjectTotalTime: updateProjectTotalTime,
		updateWorkLogTotalTime: updateWorkLogTotalTime
	}

	return publicAPI

	// **************************

	function initUI() {
		$workEntryForm = $("[rel*=js-work-entry-form")
		$workEntrySelectProject = $workEntryForm.find("[rel*=js-select-project]")
		$workEntryDescription = $workEntryForm.find("[rel*=js-work-description]")
		$workEntryTime = $workEntryForm.find("[rel*=js-work-time]")
		$workEntrySubmit = $workEntryForm.find("[rel*=js-submit-work-entry]")
		$totalTime = $("[rel*=js-total-work-time]")
		$projectList = $("[rel*=js-project-list]")

		$workEntrySubmit.on("click", submitNewWorkEntry)
	}

	function submitNewWorkEntry () {
		const projectId = Number($workEntrySelectProject.val())
		const description = $workEntryDescription.val()
		const minutes = $workEntryTime.val()

		if (!Helpers.validateWorkEntry(description, minutes)) {
			console.log('Oops, bad entry. Try again.')
			$workEntryDescription[0].focus()
			return
		}

		$workEntryDescription.val("")
		$workEntryTime.val("")
		App.addWorkToProject(projectId, description, minutes)
		$workEntryDescription[0].focus()
	}

	function addProjectToList(projectId, projectDescription) {
		var $project = $(projectTemplate);
		$project.attr("data-project-id", projectId)
		$project.find("[rel*=js-project-description]").text(projectDescription)
		$projectList.append($project);
		projectElements[projectId] = $project;
	}

	function addProjectSelection(projectId, projectDescription) {
		var $option = $("<option></option>");
		$option.attr("value", projectId)
		$option.text(projectDescription)
		$workEntrySelectProject.append($option);
	}

	function addWorkEntryToList (projectId, workEntryData) {
		var $projectEntry = projectElements[projectId];
		var $projectWorkEntries = $projectEntry.find("[rel*=js-work-entries]")

		// create a new DOM element for the work entry
		var $workEntry = $(workEntryTemplate)
		$workEntry.attr('data-work-entry-id', workEntryData.id)
		$workEntry.find('[rel*=js-work-time]').text(Helpers.formatTime(workEntryData.time))
		setupWorkDescription(workEntryData, $workEntry.find("[rel*=js-work-description]"))

		workEntryData.$element = $workEntry

		// multiple work entries now?
		if (App.getWorkEntryCount(projectId) > 1) {
			{ let adjacentWorkEntryId, insertBefore;
				[ adjacentWorkEntryId, insertBefore ] = App.getWorkEntryLocation(projectId,workEntryData.id);

				if (insertBefore) {
					workElements[adjacentWorkEntryId].before($workEntry);
				}
				else {
					workElements[adjacentWorkEntryId].after($workEntry);
				}
			}
		}
		// otherwise, just the first entry
		else {
			$projectEntry.addClass("visible");
			$projectWorkEntries.append($workEntry);
		}
	}

	function setupWorkDescription (workEntryData, $workDescription) {
		$workDescription.text(Helpers.formatWorkDescription(workEntryData.description))

		if (workEntryData.description.length > Helpers.maxVisibleWorkDescriptionLength) {
			$workDescription
			.addClass("shortened")
			.on('click', onClick = () => {
				$workDescription
				.removeClass('shortened')
				.off('click', onClick)
				.text(workEntryData.description)
			})
		}
	}

	function updateProjectTotalTime (projectId, projectTime) {
		var $projectEntry = projectElements[projectId];
		$projectEntry.find("> [rel*=js-work-time]").text(Helpers.formatTime(projectTime)).show();
	}

	function updateWorkLogTotalTime(time) {
		if (time > 0) {
			$totalTime.text(Helpers.formatTime(time)).show();
		}
		else {
			$totalTime.text("").hide();
		}
	}
}

// **************************
// **************************
// **************************

function setupApp (UI) {
	const projects = []
	let totalTime = 0;

	let publicAPI = {
		addProject: addProject,
		addWorkToProject: addWorkToProject,
		getWorkEntryCount: getWorkEntryCount,
		getWorkEntryLocation: getWorkEntryLocation
	}

	return publicAPI

	function addProject (project) {
		const projectId = Math.round(Math.random()*1E4);
		let projectEntryData = { id: projectId, description: project, work: [], time: 0}
		projects.push(projectEntryData)
		UI.addProjectToList(projectEntryData.id, projectEntryData.description)
		UI.addProjectSelection(projectEntryData.id, projectEntryData.description)
	}

	function addWorkToProject (projectId, description, minutes) {
		totalTime = (totalTime || 0) + minutes;
		var projectEntryData = findProjectEntry(projectId);
		projectEntryData.time = Number(projectEntryData.time) + minutes;

		// create a new work entry for the list
		var workEntryData = { id: projectEntryData.work.length + 1, description: description, time: minutes };
		projectEntryData.work.push(workEntryData);

		// multiple work entries now?
		if (projectEntryData.work.length > 1) {
			// sort work entries in descending order of time spent
			projectEntryData.work = projectEntryData.work.slice().sort(function(a,b){
				return b.time - a.time;
			});
		}

		UI.addWorkEntryToList(projectId, workEntryData);
		UI.updateProjectTotalTime(projectId, projectEntryData.time);
		UI.updateWorkLogTotalTime(totalTime);
	}

	function findProjectEntry(projectId) {
		for (var i = 0; i < projects.length; i++) {
			if (projects[i].id === projectId) {
				return projects[i];
			}
		}
	}

	function getWorkEntryCount(projectId) {
		var projectEntryData = findProjectEntry(projectId);
		return projectEntryData.work.length;
	}

	function getWorkEntryLocation(projectId,workEntryId) {
		var projectEntryData = findProjectEntry(projectId);

		// find where the entry sits in the new sorted list
		var entryIdx;
		for (let i = 0; i < projectEntryData.work.length; i++) {
			if (projectEntryData.work[i].id == workEntryId) {
				entryIdx = i;
				break;
			}
		}

		// insert the entry into the correct location in DOM
		if (entryIdx < (projectEntryData.work.length - 1)) {
			return [ projectEntryData.work[entryIdx + 1].id, /*insertBefore=*/true ];
		}
		else {
			return [ projectEntryData.work[entryIdx - 1].id, /*insertBefore=*/false ];
		}
	}
}






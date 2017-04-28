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

let UI = setupUI()
UI.init()

let App = setupApp(UI)

// hard coding some initial data
App.addProject("學習")
App.addProject("工作")
App.addProject("休息")
// ----------------------------
// View: Manage DOM
// ----------------------------

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

	function addProjectToList(project) {
		let projectId = project.getId()
		let projectDescription = project.getDescription()
		var $project = $(projectTemplate)
		$project.attr("data-project-id", projectId)
		$project.find("[rel*=js-project-description]").text(projectDescription)
		$projectList.append($project)
		projectElements[projectId] = $project
	}

	function addProjectSelection(project) {
		let projectId = project.getId()
		let projectDescription = project.getDescription()

		var $option = $("<option></option>");
		$option.attr("value", projectId)
		$option.text(projectDescription)
		$workEntrySelectProject.append($option);
	}

	function addWorkEntryToList (project, workEntryData) {
		var projectId = project.getId()

		var $projectEntry = projectElements[projectId];
		var $projectWorkEntries = $projectEntry.find("[rel*=js-work-entries]")

		// create a new DOM element for the work entry
		var $workEntry = $(workEntryTemplate)
		$workEntry.attr('data-work-entry-id', workEntryData.id)
		$workEntry.find('[rel*=js-work-time]').text(Helpers.formatTime(workEntryData.time))
		setupWorkDescription(workEntryData, $workEntry.find("[rel*=js-work-description]"))

		workEntryData.$element = $workEntry

		// multiple work entries now?
		if (project.getWorkEntryCount(projectId) > 1) {
			{ let adjacentWorkEntryId, insertBefore;
				[ adjacentWorkEntryId, insertBefore ] = project.getWorkEntryLocation(projectId,workEntryData.id);

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

	function updateProjectTotalTime (project) {
		var projectId = project.getId()
		var projectTime = project.getTime()

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

// ----------------------------
// Model: Manage businese logic
// ----------------------------

function setupApp (UI) {
	const projects = []
	let totalTime = 0;

	let publicAPI = {
		addProject: addProject,
		addWorkToProject: addWorkToProject,
	}

	return publicAPI

	function addProject (description) {
		// const projectId = Math.round(Math.random()*1E4);
		let project = Project(description)
		projects.push(project)

		UI.addProjectToList(project)
		UI.addProjectSelection(project)
	}

	function addWorkToProject (projectId, description, minutes) {
		totalTime = (totalTime || 0) + minutes;
		var project = findProjectEntry(projectId);
		
		// create a new work entry for the list
		let workEntryData = { description: description, time: minutes }

		project.addWork(workEntryData)

		UI.addWorkEntryToList(project, workEntryData)
		UI.updateProjectTotalTime(project)
		UI.updateWorkLogTotalTime(totalTime)
	}

	function findProjectEntry(projectId) {
		for (var i = 0; i < projects.length; i++) {
			if (projects[i].getId() === projectId) {
				return projects[i];
			}
		}
	}

}

function Project(description) {
	const projectId = Math.round(Math.random()*1E4)
	let time = 0
	let work = []

	let publicAPI = {
		getId: getId,
		getDescription: getDescription,
		getTime: getTime,
		addWork: addWork,
		getWorkEntryCount: getWorkEntryCount,
		getWorkEntryLocation: getWorkEntryLocation
	}
	return publicAPI

	function getId () {
		return projectId
	}

	function getDescription () {
		return description
	}

	function getTime () {
		return time
	}

	function addWork (workEntryData) {
		workEntryData.id = work.length + 1
		work.push(workEntryData)

		time = (time || 0) + workEntryData.time

		// multiple work entries now?
		if (work.length > 1) {
			// sort work entries in descending order of time spent
			work.sort(function sortTimeDescending(a,b){
				return b.time - a.time
			})
		}
	}

	function getWorkEntryCount () {
		return work.length
	}

	function getWorkEntryLocation (workEntryId) {

		// find where the entry sits in the new sorted list
		let entryIdx;
		for (let i = 0; i < work.length; i++) {
			if (work[i].id == workEntryId) {
				entryIdx = i
				break
			}
		}

		// insert the entry into the correct location in DOM
		if (entryIdx < (work.length - 1)) {
			return [work[entryIdx + 1].id, /*insertBefore=*/true ];
		}
		else {
			return [work[entryIdx - 1].id, /*insertBefore=*/false ];
		}
	}
}




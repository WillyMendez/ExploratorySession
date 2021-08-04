describe("Exploratory Session", function () {

	describe("when Session starts", function () {
		it("should store sarting DateTime and Browser Info", function () {

			var browserName = "TestBrowser";
			var browserVersion = "0.987.1";
			var os = "Test Os";
			var osVersion = "1.2.3";
			var cookiesEnabled = true;
			var flashVersion = "flash 21";

			var BrowserInfo = {
				browser: browserName,
				browserVersion: browserVersion,
				os: os,
				osVersion: osVersion,
				cookies: cookiesEnabled,
				flashVersion: flashVersion
			};
			var currentDateTime = new Date(2015, 10, 30, 6, 51);

			var session = new Session(currentDateTime, BrowserInfo);

			expect(session.getBrowserInfo().browser).toEqual(browserName);
			expect(session.getBrowserInfo().os).toEqual(os);
			expect(session.getBrowserInfo().osVersion).toEqual(osVersion);
			expect(session.getStartDateTime()).toEqual(currentDateTime);
		});


	});

	describe("should manage annotations: bugs, ideas, steps and notes", function () {

		var session;
		var browserName = "TestBrowser";
			var browserVersion = "0.987.1";
			var os = "Test Os";
			var osVersion = "1.2.3";
			var cookiesEnabled = true;
			var flashVersion = "flash 21";

			var BrowserInfo = {
				browser: browserName,
				browserVersion: browserVersion,
				os: os,
				osVersion: osVersion,
				cookies: cookiesEnabled,
				flashVersion: flashVersion
			};

		beforeEach(function () {
			var BrowserInfo = "TestBrowser 10.0.1.3";
			var currentDateTime = new Date(2015, 10, 30, 6, 51);

			session = new Session(currentDateTime, BrowserInfo);
		});

		it("annotations should be empty at the begining", function () {
			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(0);
		});

		it("when a bug is added there is one more annotation", function () {
			var bugName = "Add a new bug test";
			var url = "http://myTestPage.com"

			var newBug = new Bug(bugName, url);

			session.addBug(newBug);

			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(1);

			//Check that is the bug just inserted
			expect(annotations[0].getName()).toEqual(bugName);
			expect(annotations[0].getURL()).toEqual(url);

		});

		it("when a idea is added there is one more annotation", function () {
			var ideaName = "Add a new idea test";
			var url = "http://myTestPage.com"

			var newIdea = new Idea(ideaName, url);

			session.addIdea(newIdea);

			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(1);

			//Check that is the idea just inserted
			expect(annotations[0].getName()).toEqual(ideaName);
			expect(annotations[0].getURL()).toEqual(url);

		});

		it("when a note is added there is one more annotation", function () {
			var noteName = "Add a new note test";
			var url = "http://myTestPage.com"

			var newNote = new Note(noteName, url);

			session.addNote(newNote);

			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(1);

			//Check that is the Note just inserted
			expect(annotations[0].getName()).toEqual(noteName);
			expect(annotations[0].getURL()).toEqual(url);

		});

		it("when a step is added there is one more annotation", function () {
			var stepName = "Add a new step test";
			var url = "http://myTestPage.com"

			var newStep = new Step(stepName, url);

			session.addStep(newStep);

			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(1);

			//Check that is the step just inserted
			expect(annotations[0].getName()).toEqual(stepName);
			expect(annotations[0].getURL()).toEqual(url);

		});

		it("different types of annotations can be added", function () {

			session.addBug(new Bug("Add Bug"));
			session.addIdea(new Idea("Aded Idea"));
			session.addNote(new Note("Add Note"));
			session.addStep(new Step("Add Step"));

			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(4);

			//Check inserted types order
			expect(annotations[0] instanceof Bug).toBeTruthy();
			expect(annotations[1] instanceof Idea).toBeTruthy();
			expect(annotations[2] instanceof Note).toBeTruthy();
			expect(annotations[3] instanceof Step).toBeTruthy();

		});

		it("retrieve annotations by type", function () {

			session.addBug(new Bug("Add Bug"));
			session.addIdea(new Idea("Aded Idea"));
			session.addNote(new Note("Add Note"));
			session.addBug(new Bug("Add Bug2"));
			//session.addStep(new Step("Add Step"));
			session.addNote(new Note("Add Note2"));
			session.addBug(new Bug("Add Bug3"));

			var bugs = session.getBugs();
			var notes = session.getNotes();
			var ideas = session.getIdeas();
			var steps = session.getSteps();

			expect(bugs.length).toEqual(3);
			expect(notes.length).toEqual(2);
			expect(ideas.length).toEqual(1);
			expect(steps.length).toEqual(0);

		});

		it("should change any annotaion description", function () {
			session.addBug(new Bug("Add Bug"));
			session.addIdea(new Idea("Aded Idea"));
			session.addNote(new Note("Add Note"));
			session.addBug(new Bug("Add Bug2"));
			session.addNote(new Note("Add Note2"));
			session.addBug(new Bug("Add Bug3"));
			session.addStep(new Step("Add Step"));

			var annotations = session.getAnnotations();
			expect(annotations.length).toEqual(7);

			var newBugName = "new bug name";
			var newIdeaName = "new idea name";
			var newNoteName = "new note name";
			var newstepName = "new step name";

			annotations[0].setName(newBugName);
			annotations[1].setName(newIdeaName);
			annotations[2].setName(newNoteName);
			annotations[6].setName(newstepName);

			expect(annotations.length).toEqual(7);

			expect(annotations[0].getName()).toEqual(newBugName);
			expect(annotations[1].getName()).toEqual(newIdeaName);
			expect(annotations[2].getName()).toEqual(newNoteName);
			expect(annotations[6].getName()).toEqual(newstepName);


		});

		it("session annotaitons can be deleted", function () {

			session.addBug(new Bug("Add Bug"));
			session.addIdea(new Idea("Add Idea"));
			session.addNote(new Note("Add Note"));
			session.addStep(new Step("Add Step"));

			var annotations = session.getAnnotations();

			expect(annotations.length).toEqual(4);

			session.deleteAnnotation(1);

			annotations = session.getAnnotations();

			expect(annotations.length).toEqual(3);

			expect(annotations[0].getName()).toEqual("Add Bug");
			expect(annotations[1].getName()).toEqual("Add Note");
			expect(annotations[2].getName()).toEqual("Add Step");


		});

	});

});
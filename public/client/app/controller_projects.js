(function() {

  $$.ProjectsController = Backbone.Controller.extend({
    routes : {
      "investigaciones": "projects",
      "investigaciones/crear": "newProject",
      "investigaciones/:project_id": "project_call"
    },
    projects : function() {
      log("controller#projects");
      loadProjects(true);
    },
    project_call: function(project_id) {
      if ($$.Util.isNumber(project_id)) {
        log("controller#project_call");
        loadProjectCall(project_id);
        $$.layout.showInBrowser($$.projectsPresenter.el);
      }
    },
    newProject : function() {
      log("controller#newProject");
      $$.editor = new $$.ProjectEditor({
        model :new $$.Project()
      });
      $$.editor.show();
      loadProjects(true);
    }
  });

  function loadProjects(show_projects) {
    if (!$$.projects) {
      $$.projects = new $$.Projects();
      $$.projectsPresenter = new $$.ProjectsPresenter({
        model : $$.projects
      });
      $$.loading(true, $$.projects.url);
      $$.projects.fetch();
      $$.projects.bind('refresh', function() {
        $$.workspace.setProjectId($$.workspace.get('project_id'));
      });
    }
    if (show_projects)
      $$.layout.showInBrowser($$.projectsPresenter.el);
  }

  function loadProjectCall(project_id) {
    $$.workspace.setProjectId(project_id);
    $$.document = new $$.Document();
    // TODO: quizá mover esto a documento
    $$.document.url = "/projects/" + project_id + ".json"
    $$.documentPresenter = new $$.DocumentPresenter({
      model : $$.document
    });
    $$.loading(true, $$.document.url);
    $$.document.fetch();
    $$.documentPresenter.show();
  }

})();
(function($) {
  function operations_url(url) {
    return url.substr(0, url.length - 5) + "/operations.json";
  }

  $$.RepositoryPresenter = Backbone.View.extend({
    init : function() {
      console.log("REPOSITORY PRESENTER ", this.model);
      _.bindAll(this, 'render', 'show', 'setOperations', 'executeOperation', 'executeAllOperations');
      this.model.bind("change", this.render);
      this.render();
      this.operations = new $$.Operations(null, {
        url : operations_url(this.model.url)
      });
      this.setOperations();
      this.operations.bind("add", this.executeOperation);
      this.operations.bind("refresh", this.executeAllOperations);
      this.render();
    },
    setOperations : function() {
      var models = [];
      _.each(this.model.get('operations'), function(data) {
        data.params = $.parseJSON(data.params);
        var operation = new $$.Operation(data);
        models.push(operation)
      })
      this.operations.refresh(models);
    },
    show : function() {
      $("#content").html(this.el);
    },
    executeOperation : function(operation) {
      console.log("EXECUTE: ", operation);
      var model = operation.get('model');
      var action = operation.get('action');
      var operator = this.operator[model];
      var operation_function = operator ? operator[action] : null;
      operation_function && operation_function(operation, this);
    },
    executeAllOperations : function() {
      console.log("Add all operations: " + this.operations);
      _.each(this.operations.models, this.executeOperation);
    }
  });
})(jQuery);
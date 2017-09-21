;(function ( $, window, document, undefined ) {
$.widget( "figgy.filemanager", {
    options: {
        images: [],
        selected: [],
        blank: {
          'id': '',
          'label': '',
          'url': '',
          'pageType': 'single',
          'isThumb': null,
          'isStart': null
        }
    },
    _create: function() {

        this._createGallery()
        this._createDetailSidebar()
        this._createForm()
        this._createControls()

        var _this = this;

        // add event handlers
        this._on(this.document, {
  				'click.thumbnail': function(event) {
            if (event.metaKey) {
              console.log("CMD")
              _this.handleSelectPage(event.target.id)
            } else if (event.shiftKey) {
              console.log("shift")
            } else {
              this.deselectAll()
              _this.handleSelectPage(event.target.id)
            }
  				}
  			});

        this._on(this.document, {
          'click#save_btn': function(event) {
            this.save()
  				}
        });

        this._on(this.document, {
          'input#label': function(event) {
            this.options.selected[0].label = $( '#label' ).val()
  				}
        });

        // Note: this relies on jQuery UI Sortable widget
        // Since jQuery UI is a dependency, we can lean on it
        // and look into optimizing with HTML5 native DnD if needed
        this.element.find( "#sortable" ).sortable({
          update: function( event, ui ) {
            var sortedIDs = $( "#sortable" ).sortable( "toArray" );
            _this._saveSort(sortedIDs);
          }
        });

        // paint the img_collection here
        this.refresh()
    },
    _createGallery: function() {
      var $content = $('<div class="content"></div>')
      var $gallery = $('<div class="img_gallery" id="sortable" class="col-md-12"></div>')
      $content.append( $gallery )
      this.element.append( $content )
    },
    _createDetailSidebar: function() {
      var $sidebar = $('<div class="sidebar"></div>')
      var $detail = $('<div id="detail" class="actions"></div>')
      var $img_detail = $('<img id="detail_img" src=""></img>')
      $detail.append( $img_detail )
      $sidebar.append( $detail )
      this.element.append( $sidebar )
    },
    _createForm: function() {
      var $form_panel = $('<div class="formPanel actions"></div>')
      var $noneSelected = $('<p id="noneSelected" class="formContent">No items selected.</p>')
      var $multiSelected = $('<p id="multiSelected" class="formContent">Multiple items are selected.</p>')
      var singleSelected = '<form id="singleSelected" class="formContent form-horizontal">'+
                   '<div class="form-group">' +
                      '<label class="control-label" for="label">Label</label>' +
                      '<input type="text" name="label" id="label" value="1" class="form-control">' +
                   '</div>' +
                   '<div class="form-group">' +
                   '<label class="control-label" for="pageType">Page Type</label>' +
                      '<select id="pageType" class="form-control">' +
                      '<option value="single">Single Page (Default)</option>' +
                      '<option value="non-paged">Non-Paged</option>' +
                      '<option value="facing">Facing Pages</option>' +
                    '</select>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<div class="checkbox">' +
                      '<label>' +
                        '<input id="isThumb" type="checkbox" value="">' +
                        'Set as Thumbnail <a href="#">(?)</a>' +
                      '</label>' +
                  '</div>' +
                    '<div class="checkbox">' +
                      '<label>' +
                        '<input id="isStart" type="checkbox" value="">' +
                        'Set as Start Page <a href="#">(?)</a>' +
                      '</label>' +
                    '</div>' +
                  '</div>' +
                  '<input id="canvas_id" type="hidden" name="canvas_id"></form>'

      $form_panel.append( $noneSelected, $multiSelected, singleSelected )
      this.element.append( $form_panel )
    },
    _createControls: function() {
      var $controls = $('<div class="controls"></div>')
      var $button = $('<button id="save_btn" name="button" type="button" class="btn btn-primary">Save</button>')
      $controls.append( $button )
      this.element.append( $controls )
    },
    deselectAll: function() {
      this.options.selected = []
    },
    _paintSelected: function() {
      // loop through and add class to all the ids
      $('.thumbnail img').removeClass('selected')
      for (i = 0; i < this.options.selected.length; i++) {
        var element = document.getElementById(this.options.selected[i].id)
        element.className += " selected";
      }
    },
    getImageById: function( id ) {
      var elementPos = this.options.images.map(function(image) {
        return image.id
      }).indexOf(id)
      return this.options.images[elementPos]
    },
    handleSelectPage: function( select_id ) {
      this.options.selected.push(this.getImageById(select_id))
      $( '.formContent' ).hide()
      switch (this.options.selected.length) {
        case 0:
          $( '#noneSelected' ).show()
          break
        case 1:
          var selected = this.options.selected[0]
          $( '#label' ).val(selected.label)
          $( '#pageType option[value="'+ selected.pageType +'"]' ).prop('selected', true)
          $( '#isThumb' ).prop( "checked", selected.isThumb )
          $( '#isStart' ).prop( "checked", selected.isStart )
          $( '#canvas_id' ).val(selected.id)
          $( '#detail_img' ).attr("src",selected.url)
          $( '#singleSelected' ).show()
          break
        default:
          $( '#multiSelected' ).show()
      }
      console.log(this.options.selected)
      this._paintSelected()
    },
    paintPage: function( page, index, array ) {
      $( "<div id='" + index + "' class='thumbnail'></div>" )
      .appendTo( "#sortable" )
      .html( "<img id='" + page.id + "' src='" +
            page.url +
            "'><div class='caption'>" + page.label + "</div>" );
    },
    _saveSort: function( sortedIDs ) {
      var new_imgArr = [];
      var arrayLength = sortedIDs.length;
      for (var i = 0; i < arrayLength; i++) {
        new_imgArr[i] = this.options.images[sortedIDs[i]];
      }
      this.options.images = new_imgArr;
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    _setOptions: function( options ) {
        this._super( options );
    },
    refresh: function() {
      $( "#sortable" ).empty();
      this.options.images.forEach(this.paintPage);
    },
    reset: function() {
      this._destroy();
      this._create();
    },
    save: function() {
      for (i = 0; i < this.options.selected.length; i++) {
        var index = this.options.images.map(function(img) {
          return img.id;
        }).indexOf(this.options.selected[i].id);
        this.options.images[index] = this.options.selected[i]
      }

      this.refresh()
      //  This could save it to a server if we want
      //  but for now just emit an event
      this.element.trigger( "objectSaved", [this.options.images] );
    },
    _destroy: function() {
        this.element
            .removeClass( "filemanager" )
            .text( "" );
    }
});
})( jQuery, window, document );

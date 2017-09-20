;(function ( $, window, document, undefined ) {
$.widget( "figgy.filemanager", {
    options: {
        images: [],
        selected: {
          'id': '',
          'label': '',
          'url': '',
          'pageType': 'single',
          'isThumb': null,
          'isStart': null
        }
    },
    _create: function() {

        this.createGallery()
        this.createDetailSidebar()
        this.createForm()
        this.createControls()

        var _this = this;

        // add event handlers
        this._on(this.document, {
  				'click.thumbnail': function(event) {
            _this.handleSelectPage(event.target.id)
  				}
  			});

        this._on(this.document, {
          'click#save_btn': function(event) {
            this.save()
  				}
        });

        this._on(this.document, {
          'input#label': function(event) {
            this.options.selected.label = $( '#label' ).val()
            window.selected = this.options.selected;
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
    createGallery: function() {
      var $content = $('<div class="content"></div>')
      var $gallery = $('<div class="img_gallery" id="sortable" class="col-md-12"></div>')
      $content.append( $gallery )
      this.element.append( $content )
    },
    createDetailSidebar: function() {
      var $sidebar = $('<div class="sidebar"></div>')
      var $detail = $('<div id="detail" class="actions"></div>')
      var $img_detail = $('<img id="detail_img" src=""></img>')
      $detail.append( $img_detail )
      $sidebar.append( $detail )
      this.element.append( $sidebar )
    },
    createForm: function() {
      var $form = $('<div class="form actions"></div>')

      var markup = '<form id="page_metadata_form" class="form-horizontal">'+
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

      $form.append( markup )
      this.element.append( $form )
    },
    createControls: function() {
      var $controls = $('<div class="controls"></div>')
      var $button = $('<button id="save_btn" name="button" type="button" class="btn btn-primary">Save</button>')
      $controls.append( $button )
      this.element.append( $controls )
    },
    getImageIndexById: function( id ) {
      var elementPos = this.options.images.map(function(image) {
        return image.id
      }).indexOf(id)
      return this.options.images[elementPos]
    },
    handleSelectPage: function( select_id ) {
      var selected = this.getImageIndexById(select_id)
      $( '#label' ).val(selected.label)
      $( '#pageType option[value="'+ selected.pageType +'"]' ).prop('selected', true)
      $( '#isThumb' ).prop( "checked", selected.isThumb )
      $( '#isStart' ).prop( "checked", selected.isStart )
      $( '#canvas_id' ).val(selected.id)
      $( '#detail_img' ).attr("src",selected.url)
      this.options.selected = selected
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
        var index = this.options.images.map(function(img) {
          return img.id;
        }).indexOf(this.options.selected.id);
        this.options.images[index] = this.options.selected
        this.refresh()
        //  This will save it to a server if we want
        //  or we can just emit an event
        this.element.trigger( "objectSaved", [this.options.images] );
    },
    _destroy: function() {
        this.element
            .removeClass( "filemanager" )
            .text( "" );
    }
});
})( jQuery, window, document );

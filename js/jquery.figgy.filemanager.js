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
        this.changeList = []
        this.original_order = []
        this._createGallery()
        this._createDetailSidebar()
        this._createForm()
        this._createControls()

        var _this = this;

        // add event handlers
        this._on(this.document, {
  				'click.thumbnail': function(event) {
            _this.handleSelectPage(event)
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
            this.applyChanges()
  				}
        });

        this._on(this.document, {
          'input[type=range]': function(event) {
            $( '.thumbnail' ).css("max-width", event.target.value + 'px')
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
    applyChanges: function() {
      // TODO: Keep a list of all changed ids so we can mark them as changed
      // or perhaps add a property to images
      for (i = 0; i < this.options.selected.length; i++) {
        var index = this.options.images.map(function(img) {
          return img.id;
        }).indexOf(this.options.selected[i].id);
        this.options.images[index] = this.options.selected[i]
        if (this.changeList.indexOf(this.options.selected[i].id) == -1) {
          this.changeList.push(this.options.selected[i].id)
        }
      }

      this.refresh()
    },
    _createGallery: function() {
      var $content = $('<div class="content"></div>')
      var $gallery_controls = $('<div class="gallery_controls">' +
          'Select: <button class="btn btn-default btn-sm"><i class="fa fa-th"></i> All</button>' +
          '<button class="btn btn-default btn-sm"><i class="fa fa-th fa-inverse"></i> None</button>' +
          '<button class="btn btn-default btn-sm"><i class="fa fa-th fa-inverse"></i> Alternate</button>' +
          '<button class="btn btn-default btn-sm"><i class="fa fa-th fa-inverse"></i> Inverse</button>' +
          '<div id="img_sizer"><i class="fa fa-image"></i> <input style="display:inline-block;" type="range" min="40" max="400" value="200"> <i class="fa fa-image fa-lg"></i></div>' +
          '</div>')
      var $gallery = $('<div class="img_gallery" id="sortable" class="col-md-12"></div>')
      $content.append( $gallery_controls )
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
      var $controls = $('<div class="controls"><div id="orderChangedIcon" class="alert alert-info" role="alert"><i class="fa fa-exchange"></i> Page order has changed.</div></div>')
      var $button = $('<button id="save_btn" name="button" type="button" class="btn btn-lg btn-primary">Save</button>')
      $controls.append( $button )
      this.element.append( $controls )
    },
    deselectAll: function() {
      this.options.selected = []
    },
    deselectOne: function() {
      this.options.selected.splice(this.getImageById(event.target.id), 1)
    },
    getImageIndexById: function( id ) {
      return this.options.images.map(function(image) {
        return image.id
      }).indexOf(id)
    },
    getImageById: function( id ) {
      var elementPos = this.getImageIndexById(id)
      return this.options.images[elementPos]
    },
    getSelectedIndexById: function( id ) {
      return this.options.selected.map(function(image) {
        return image.id
      }).indexOf(id)
    },
    handleSelectPage: function( event ) {
      var image_id = $(event.target).find( "img" ).attr('id');
      if (event.metaKey) {
        if(this.isSelected(image_id)){
          this.options.selected.splice(this.getSelectedIndexById(image_id), 1)
          console.log(this.options.selected)
        }else{
          this.options.selected.push(this.getImageById(image_id))
        }
      } else if (event.shiftKey) {
        console.log("Shift + Click")
      } else {
        this.deselectAll()
        this.options.selected.push(this.getImageById(image_id))
      }

      // update form panel
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
      this._paintSelected()
    },
    hasChanged: function(id) {
      if (this.changeList.indexOf(id) == -1) {
        return false
      } else {
        return true
      }
    },
    isSelected: function(select_id) {
      var index = this.options.selected.map(function(img) {
        return img.id;
      }).indexOf(select_id);
      if( index == -1) {
        return false
      } else {
        return true
      }
    },
    originalOrderChanged: function( sortedIDs ) {
      return JSON.stringify(this.original_order) !== JSON.stringify(sortedIDs);
    },
    _paintPages: function() {
      var totalImages = this.options.images.length
      _this = this
      for (var i = 0; i < totalImages; i++) {
        var item_state = _this.hasChanged(_this.options.images[i].id) ? 'hasChanged' : ''
        var $thumbnail = $( "<div id='" + i + "' class='thumbnail " + item_state + "'></div>" )
        img_markup = "<img class='thumb' id='" + _this.options.images[i].id + "' src='" +
              _this.options.images[i].url +
              "'><div class='caption'>" + _this.options.images[i].label + "</div>"
        $thumbnail.append(img_markup)
        $( '#sortable' ).append($thumbnail)
      }
      this._paintSelected()
      // set original order
      if( this.original_order.length === 0 ){
        this.original_order = $( "#sortable" ).sortable( "toArray" );
      }
    },
    _paintSelected: function() {
      // loop through and add class to all the ids
      $('.thumbnail').removeClass('selected')
      for (i = 0; i < this.options.selected.length; i++) {
        var element = document.getElementById(this.options.selected[i].id).parentElement
        element.className += " selected";
      }
    },
    _saveSort: function( sortedIDs ) {
      var new_imgArr = [];
      var arrayLength = sortedIDs.length;
      for (var i = 0; i < arrayLength; i++) {
        new_imgArr[i] = this.options.images[sortedIDs[i]];
      }
      this.options.images = new_imgArr;
      if( this.originalOrderChanged( sortedIDs ) ) {
        $( "#orderChangedIcon" ).show();
      } else {
        $( "#orderChangedIcon" ).hide();
      }
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    _setOptions: function( options ) {
        this._super( options );
    },
    refresh: function() {
      $( "#sortable" ).empty();
      this._paintPages()
    },
    reset: function() {
      this._destroy();
      this._create();
    },
    save: function() {
      this.applyChanges()
      //  This could save it to a server if we want
      //  but for now just emit an event
      this.element.trigger( "objectSaved", [this.options.images] )
      // TODO: investigate why reset seems to prevent us from listening for the 'metaKey'
      // Implementing "softReset()"" now as a workaround.
      // this.reset()
      this.softReset()
      alert('Changes saved!')
    },
    softReset: function() {
      this.deselectAll()
      this.changeList = []
      this.refresh()
    },
    _destroy: function() {
        this.element
            .removeClass( "filemanager" )
            .text( "" );
    }
});
})( jQuery, window, document );

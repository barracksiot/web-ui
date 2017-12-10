/*
 * MIT License
 *
 * Copyright (c) 2017 Barracks Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * This is a sample chart export config file. It is provided as a reference on
 * how miscelaneous items in export menu can be used and set up.
 *
 * Please refer to README.md for more information.
 */

/**
 * PDF-specfic configuration
 */
AmCharts.exportDrawingMenu = [ {
  class: "export-drawing",
  label: "Export",
  menu: [ {
    label: "Undo",
    click: function() {
      this.drawing.handler.undo();
    }
  }, {
    label: "Redo",
    click: function() {
      this.drawing.handler.redo();
    }
  }, {
    label: "Cancel",
    click: function() {
      this.drawing.handler.done();
    }
  }, {
    label: "Save",
    menu: [ {
      label: "JPG",
      click: function() {
        this.drawing.handler.done();
        this.toJPG( {}, function( data ) {
          this.download( data, "image/jpg", "amCharts.jpg" );
        } );
      }
    }, {
      label: "PNG",
      click: function() {
        this.drawing.handler.done();
        this.toPNG( {}, function( data ) {
          this.download( data, "image/png", "amCharts.png" );
        } );
      }
    }, {
      label: "PDF",
      click: function() {
        this.drawing.handler.done();
        this.toPDF( {}, function( data ) {
          this.download( data, "application/pdf", "amCharts.pdf" );
        } );
      }
    }, {
      label: "SVG",
      click: function() {
        this.drawing.handler.done();
        this.toSVG( {}, function( data ) {
          this.download( data, "text/xml", "amCharts.svg" );
        } );
      }
    } ]
  } ]
} ];


/**
 * Define main universal config
 */
AmCharts.exportCFG = {
  enabled: true,
  libs: {
    path: "../libs/"
  },
  menu: [ {
    class: "export-main",
    label: "Export",
    menu: [
      /*
       ** DRAWING
       */
      {
        label: "Draw",
        click: function() {
          this.capture( {
            action: "draw",
            freeDrawingBrush: {
              width: 2,
              color: "#000000",
              shadow: {
                color: "rgba(0,0,0,0.3)",
                blur: 10,
                offsetX: 3,
                offsetY: 3
              }
            }
          }, function() {
            this.createMenu( AmCharts.exportDrawingMenu );
          } );
        }
      },

      /*
       ** DELAYED DRAWING
       */
      {
        label: "Delayed draw",
        action: "draw",
        delay: 2
      },

      /*
       ** DELAYED EXPORT; automatical download
       */
      {
        label: "Delayed save",
        format: "png",
        delay: 2
      },

      /*
       ** WATERMARK EXPORT; Post procesing
       */
      {
        label: "Watermark",
        format: "png",
        action: false, // Avoids automatical downloads
        afterCapture: function() {
          var canvas = this.setup.fabric;
          var watermark = new fabric.Text("watermark",{
            originX: "center",
            originY: "center",
            top: canvas.height / 2,
            left: canvas.width / 2,
            fontSize: 50,
            opacity: 0.4
          });

          // Add watermark to canvas
          // In case of images ensure the images has been fully loaded before converting
          canvas.add(watermark);

          // Convert to PNG
          this.toPNG({},function(base64) {
            var format = this.defaults.formats.PNG;
            var fileType = format.mimeType;
            var fileName = "amCharts." + format.extension;
            var fileData = base64;

            // Trigger download
            this.download(fileData,fileType,fileName);
          });
        }
      },

      /*
       ** DOWNLOAD
       */
      {
        label: "Download",
        menu: [ {
          label: "JPG",
          click: function() {
            this.capture( {}, function() {
              this.toJPG( {}, function( data ) {
                this.download( data, "image/jpg", "amCharts.jpg" );
              } );
            } );
          }
        }, {
          label: "PNG",
          click: function() {
            this.capture( {}, function() {
              this.toPNG( {}, function( data ) {
                this.download( data, "image/png", "amCharts.png" );
              } );
            } );
          }
        }, {
          label: "PDF",
          click: function() {
            this.capture( {}, function() {
              this.toPDF( {}, function( data ) {
                this.download( data, "application/pdf", "amCharts.pdf" );
              } );
            } );
          }
        }, {
          label: "PDF + data",
          click: function() {
            this.capture( {}, function() {
              var tableData = this.setup.chart.dataProvider;
              var tableBody = this.toArray( {
                withHeader: true,
                data: tableData
              } );

              var tableWidths = [];
              var content = [ {
                image: "reference",
                fit: [ 523.28, 769.89 ]
              } ];

              for ( i in tableBody[ 0 ] ) {
                tableWidths.push( "*" );
              }

              content.push( {
                table: {
                  headerRows: 1,
                  widths: tableWidths,
                  body: tableBody
                },
                layout: 'lightHorizontalLines'
              } );

              this.toPDF( {
                content: content
              }, function( data ) {
                this.download( data, "application/pdf", "amCharts.pdf" );
              } );
            } );
          }
        }, {
          label: "SVG",
          click: function() {
            this.capture( {}, function() {
              this.toSVG( {}, function( data ) {
                this.download( data, "text/xml", "amCharts.svg" );
              } );
            } );
          }
        }, {
          label: "CSV",
          click: function() {
            this.toCSV( {}, function( data ) {
              this.download( data, "text/plain", "amCharts.csv" );
            } );
          }
        }, {
          label: "JSON",
          click: function() {
            this.toJSON( {}, function( data ) {
              this.download( data, "text/plain", "amCharts.json" );
            } );
          }
        }, {
          label: "XLSX",
          click: function() {
            this.toXLSX( {}, function( data ) {
              this.download( data, "application/octet-stream", "amCharts.xlsx" );
            } );
          }
        } ]
      }
    ]
  } ]
};

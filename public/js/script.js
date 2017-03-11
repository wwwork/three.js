/*
TODO

    �������� �� �����
    http://jsfiddle.net/C5dga/13/
    �������� ������

*/                
var scene, camera, 
    cameraPosition, cameraX, 
    cameraY, cameraZ, gui, 
    controls, sceneJson, exporter;

                
var renderer = new THREE.WebGLRenderer();
                
var scene = new THREE.Scene();
                
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var group = new THREE.Object3D();//create an empty container

var cameraX = 90;
                
var cameraY = 75; 
                
var cameraZ = 250;  

function draw_texture() 
{
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;    
  var ctx = canvas.getContext('2d');
  ctx.drawImage(document.getElementById('front'), 0, 0);
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
} // draw_texture
                
var init = function ()
{
             renderer.setSize( window.innerWidth, window.innerHeight );
             
             renderer.shadowMapEnabled = true;
             
             document.body.appendChild( renderer.domElement );
        
        var orbit = new THREE.OrbitControls( camera, renderer.domElement );
        
        orbit.enableZoom = true;

        var axes = new THREE.AxisHelper( 20 );

        scene.add(axes);

        // instantiate a loader
        var loader = new THREE.TextureLoader();

        // load a resource
        loader.load(
            // resource URL
            '/public/images/bricks.jpg',
            // Function when resource is loaded
            function ( texture ) 
            {
                var planeGeometry = new THREE.PlaneGeometry(160,220);
                // do something with the texture
                var planeMaterial = new THREE.MeshLambertMaterial( {
                    color: 0xcccccc, 
                    map: texture
                 } );
                     
                var plane = new THREE.Mesh(planeGeometry,planeMaterial);
				
                plane.rotation.x = -0.5*Math.PI;
                
				plane.position.x = 15;

				plane.position.y = 0;

				plane.position.z = 0;

				plane.receiveShadow = true;
                
				scene.add(plane);
            },
            // Function called when download progresses
            function ( xhr ) 
            {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) 
            {
                console.log( 'An error happened' );
            }
        );
        var length = 3, width = 50;
                        
        var shape = new THREE.Shape();
                        
                        shape.moveTo( 0,0 );
                        
                        shape.lineTo( 0, width );
                        
                        shape.lineTo( length, width );
                        
                        shape.lineTo( length, 0 );
                        
                        shape.lineTo( 0, 0 );

                        
        var extrudeSettings = {
                        steps: 1,
                        
                        amount: 90,
                        
                        bevelEnabled: false,
                        
                        bevelThickness: 0.5,
                        
                        bevelSize: 0.5,
                        
                        bevelSegments: 8,
                        
                        UVGenerator: THREE.ExtrudeGeometry.BoundingBoxUVGenerator
         };

        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	
		// load a texture, set wrap mode to repeat
		var texture = new THREE.TextureLoader().load( '/public/images/br.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		
		texture.wrapT = THREE.RepeatWrapping;
	
		texture.repeat.set( 0.011, 0.011 );

        var material = new THREE.MeshLambertMaterial( { color: 0xffffff, map:texture} );
                           
        var mesh = new THREE.Mesh( geometry, material ) ;

                            mesh.rotation.y += 0.02;

                            mesh.castShadow = true;
							
							group.add( mesh );//add a mesh with geometry to it
                            
							scene.add( mesh );
 
		var meshNewWall = new THREE.Mesh( geometry, material ) ;

                            meshNewWall.rotation.y += 0.02;

                            meshNewWall.castShadow = true;
							
							mesh.position.set( -50, 0, -25 );
							
							meshNewWall.position.set( 40, 0, -30 );
							
							meshNewWall.rotation.y = 17.30;
							
							console.log(meshNewWall);

							scene.add( meshNewWall );
       var lights = [];
        
            lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            
            lights[ 0 ].position.set( 0, 200, 0 );

            scene.add( lights[ 0 ] );

           

        var spotLight = new THREE.SpotLight( 0xffffff );

                            spotLight.position.set( 120, 120, 100 );

                            spotLight.castShadow = true;
                            
                            scene.add(spotLight);

                            camera.lookAt(new THREE.Vector3(0, 0, 0));

                            camera.position.set(50, 150, 200);
                            //camera.position.set(cameraX, cameraY, cameraZ);
                            
                            controls = new function () 
                            {
                               this.exportScene = function () 
                               {
                                        exporter = new THREE.OBJExporter();

                                        result = exporter.parse(scene);
                                    
                                        $.post( "/api/put_scene", {"scene":result})
                                            .done(function( data ) {
                                                console.log( "Data to SERVER posted and recieved : " + data );
                                        });

                                        console.log(result);
                                };
                            this.clearScene = function () 
                            {
                                    scene = new THREE.Scene();
									
                                    console.log('scene cleared');
                            };
                            this.importScene = function () {
                                
        var loader = new THREE.OBJLoader();
                                loader.load('scene.json', function ( object )
                                {
                                    //object.position.x = - 60;
                                    //object.rotation.x = 20* Math.PI / 180;
                                    //object.rotation.z = 20* Math.PI / 180;
                                    //object.scale.x = 30;
                                    //object.scale.y = 30;
                                    //object.scale.z = 30;
                                    obj = object;    
                                        scene.add( obj );
                                        animate();
                                    });
                                }
                            };

                            gui = new dat.GUI();

                            gui.add(controls, "exportScene");

                            gui.add(controls, "clearScene");

                            gui.add(controls, "importScene");
                    
                    
                    
                } // end init
                
                
var render = function () 
                {
                        renderer.render(scene, camera);
                };
                
                function animate() 
                {
                    requestAnimationFrame( animate );
                    render();
                }
                    
              /*  $( "body" ).mouseup(function() 
                {
                    // objcoord
                        $.post( "/api/put_coord", { "x": camera.position.x, "y": camera.position.y, "z":camera.position.z })

                            .done(function( data ) {

                                 console.log( "Data to SERVER posted and recieved : " + data );
                        });

                         console.log('cameraPOS --> '+camera.position.x);
                    });*/
					
                $( document ).ready( function() 
					{
						init();

                        animate();

                                  /*  $.get("/api/get_coord")

                                     .done(function(data) 

                                      {
                                     // if load last camera position 
                                         if ( data != "404"){

                                             console.log("START Data Loaded camera XYZ: " + data.x + " "+data.y + " " +data.y );

                                             cameraX = data.x;

                                             cameraY = data.y; 

                                             cameraZ = data.z;    
                                         }
                                         init();

                                         animate();
                                     })
                                    .fail(function() 
                                    {
                                    //console.log("if fail, initiate scene and render, init with def. coord: "+cameraX+" "+cameraY+" "+cameraZ);
                                    // if fail, initiate scene and render
                                            init();
                                            animate();

                                    })*/
                                  });
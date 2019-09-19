require(
	{
		packages:[
			{
				name:'babylonjs',
				//location:'/widgets/MxBabylonJS/lib/babylonjscdn',
				location:'/widgets/MxBabylonJS/lib/babylonjs',
				main:'babylon.max',
			},
			{
				name:'babylonjs_materials',
				//location:'/widgets/MxBabylonJS/lib/babylonjscdn',
				location:'/widgets/MxBabylonJS/lib/babylonjs/materialsLibrary',
				main:'babylonjs.materials',
			},
			{
				name:'pep',
				//location:'/widgets/MxBabylonJS/lib/babylonjscdn',
				location:'/widgets/MxBabylonJS/lib/pep',
				main:'pep',
			}
			/* ???
			shim : {
				babylonjs: {deps: ['pep']}
			}
			*/
		]
	},
	[
		'dojo/_base/declare',
		'mxui/widget/_WidgetBase',
		'dijit/_TemplatedMixin',
		'mxui/dom',
		'dojo/dom',
		'dojo/dom-prop',
		'dojo/dom-geometry',
		'dojo/dom-class',
		'dojo/dom-style',
		'dojo/dom-construct',
		'dojo/_base/array',
		'dojo/_base/lang',
		'dojo/text',
		'dojo/html',
		'dojo/_base/event',
		'babylonjs',
		'babylonjs_materials',
		'pep',
		'dojo/text!MxBabylonJS/widget/template/MxBabylonJS.html'
	],
	function(
		declare,
		_WidgetBase,
		_TemplatedMixin,
		dom,
		dojoDom,
		dojoProp,
		dojoGeometry,
		dojoClass,
		dojoStyle,
		dojoConstruct,
		dojoArray,
		lang,
		dojoText,
		dojoHtml,
		dojoEvent,
		babylonjs,
		babylonjs_materials,
		pep,
		widgetTemplate
	){
		"use strict";
		//var $ = _jQuery.noConflict(true);
		return declare(
			"MxBabylonJS.widget.MxBabylonJS",
			[
				_WidgetBase,
				_TemplatedMixin
			],{
				templateString:widgetTemplate,
				widgetBase:null,
				_handles:null,
				_contextObj:null,
				isLoading:false,
				isRunning:false,
				constructor:function(){
					this._handles=[];
				},
				postCreate:function(){
					mx.ui.info('3');
					window.wid=this;
					this.canvas=dojo.create(
						"canvas",
						{
							'id':'renderCanvas',//this.id+'_canvas',
							'touch-action':'none',
							'width':'320px',
							'height':'320px',
							'style':'width:100%;'
						}
					);
					this.domNode.appendChild(
						this.canvas
					);
					//this.test0();
				},
				test0:function(){
					var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
					var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

					/******* Add the create scene function ******/
					var createScene = function () {

						// Create the scene space
						var scene = new BABYLON.Scene(engine);

						// Add a camera to the scene and attach it to the canvas
						var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
						camera.attachControl(canvas, true);

						// Add lights to the scene
						var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
						var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

						// Add and manipulate meshes in the scene
						var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

						return scene;
					};
					/******* End of the create scene function ******/	

					this.scene = createScene(); //Call the createScene function

					// Register a render loop to repeatedly render the scene
					engine.runRenderLoop(function () { 
							this.scene.render();
					});

					// Watch for browser/canvas resize events
					window.addEventListener("resize", function () { 
							engine.resize();
					});

				},
				test1:function(urlP){
					if(!typeof(urlP)=='string'){
						this.isLoading=false;
						this.isRunning=false;
						return;
					}
					this.canvas = document.getElementById("renderCanvas"); // Get the canvas element 
					if(BABYLON.Engine.isSupported()){
						var canvas=document.getElementById("renderCanvas");
						this.engine=this.engine==null?new BABYLON.Engine(canvas,true):this.engine;
						BABYLON.SceneLoader.Load("/",urlP,this.engine,dojo.hitch(this,function(scene){
							this.scene=scene;
							// Wait for textures and shaders to be ready
							this.scene.executeWhenReady(dojo.hitch(this,function () {
								// Attach camera to canvas inputs
								var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5),scene);
								camera.attachControl(this.canvas, true);
								// Add lights to the scene
								//var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
								//var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
								// Once the scene is loaded, just register a render loop to render it
								this.engine.runRenderLoop(dojo.hitch(this,function() {
									scene.render();
								}));
							}));
						}), function (progress) {
							// To do: give progress feedback to user
						});
						// Watch for browser/canvas resize events
						window.addEventListener("resize", dojo.hitch(this,function () { 
								this.engine.resize();
						}));

					}
				},

				update:function(obj,callback){
					this._contextObj=obj;
					this._updateRendering(callback);
				},
				resize:function(box){
				},
				uninitialize:function(){
				},
				_updateRendering:function(callback){
					if(this._contextObj!==null){
						if(!this.isLoading){
							//dojoStyle.set(this.domNode,"display","block");
							console.log('0----------------------------------------');
							console.log(this._contextObj);
							var _url='file?guid='+this._contextObj.getGuid()+'&cachebust='+(new Date().getTime())+'&filename='+(this._contextObj.get('Name')==null||this._contextObj.get('Name')==''?'.babylon':this._contextObj.get('Name'));
							console.log(_url);
							console.log('1----------------------------------------');
							try{
								this.isLoading=true;
								//this.test1('a.babylon');//'BoomBox.gltf');//'cornellBox.glb');//'Duck.gltf');//'a.babylon');//url);
								this.engine!=null?this.engine.stopRenderLoop():null;
								this.scene!=null?this.scene.dispose():null;
								this.test1(_url);
								this.isRunning=true;
							}catch(e){
								console.error(e);
							}finally{
								this.isLoading=false;
								this.isRunning=false;
							}

						}else{
						}
					}else{
						//dojoStyle.set(this.domNode,"display","none")	;
					}
					this._executeCallback(callback,"_updateRendering");
				},
				_execMf:function(mf,guid,cb){
					if(mf&&guid){
						mx.ui.action(mf,{
							params:{
								applyto:"selection",
								guids:[guid]
							},
							callback:lang.hitch(this,function(objs){
								if(cb&&typeof cb==="function"){
									cb(objs);
								}
							}),
							error:function(error){
								console.debug(error.description);
							}
						},this);
					}
				},
				_executeCallback:function(cb,from){
					if(cb&&typeof cb==="function"){
						cb();
					}
				}
		});
	}
);
//require(["MxBabylonJS/widget/MxBabylonJS"]);

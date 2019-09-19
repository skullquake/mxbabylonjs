require(
	{
		packages:[
			{
				name:'babylonjs',
				location:'/widgets/MxBabylonJS/lib/babylonjscdn',
				main:'babylon.max',
			},
			{
				name:'babylonjs_materials',
				location:'/widgets/MxBabylonJS/lib/babylonjscdn',
				main:'babylonjs.materials',
			},
			{
				name:'pep',
				location:'/widgets/MxBabylonJS/lib/babylonjscdn',
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
				constructor:function(){
					this._handles=[];
				},
				postCreate:function(){
					this.domNode.appendChild(
						dojo.create(
							"canvas",
							{
								'id':'renderCanvas',//this.id+'_canvas',
								'touch-action':'none',
								'width':'320px',
								'height':'320px'
							}
						)
					);
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

        var scene = createScene(); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () { 
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () { 
                engine.resize();
        });
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
					/*
					if(this._contextObj!==null){
						dojoStyle.set(this.domNode,"display","block");
					}else{
						dojoStyle.set(this.domNode,"display","none")	;
					}
					*/
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

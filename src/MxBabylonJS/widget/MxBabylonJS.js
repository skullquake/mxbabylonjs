require(
	{
		packages:[
			{
				name:'babylonjs',
				//location:'/widgets/MxBabylonJS/lib/babylonjs',
				location:'/widgets/MxBabylonJS/lib',
				main:'babylon'
			}
		]
	},
	[
		'dojo/_base/declare',
		'mxui/widget/_WidgetBase',
		'dijit/_TemplatedMixin',
		'mxui/dom',
		'dojo/dom',
		'dojo/dom-attr',
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
		'dojo/text!MxBabylonJS/widget/template/MxBabylonJS.html'
	],
	function(
		declare,
		_WidgetBase,
		_TemplatedMixin,
		dom,
		domAttr,
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
		widgetTemplate
	){
		"use strict";
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
					//this.domNode.appendChild(this.canvas);
				},
				draw:function(urlP){
					if(!typeof(urlP)=='string'){
						this.isLoading=false;
						this.isRunning=false;
						return;
					}
					if(BABYLON.Engine.isSupported()){
						var canvas=this.canvas;
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
							var _url='file?guid='+this._contextObj.getGuid()+'&cachebust='+(new Date().getTime())+'&filename='+(this._contextObj.get('Name')==null||this._contextObj.get('Name')==''?'.babylon':this._contextObj.get('Name'));
							try{
								this.isLoading=true;
								this.engine!=null?this.engine.stopRenderLoop():null;
								this.scene!=null?this.scene.dispose():null;
								this.draw(_url);
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

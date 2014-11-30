

/***************************************************************************************
 * jQuery.themepunch.ShowBiz Pro.js - jQuery Plugin for ShowBiz Pro Teaser Rotator
 * @version: 1.4 (22.11.2013)
 * @requires jQuery v1.7 or later
 * @author ThemePunch
****************************************************************************************/



(function(jQuery,undefined){


	////////////////////////////////////////
	// THE REVOLUTION PLUGIN STARTS HERE //
	///////////////////////////////////////

	jQuery.fn.extend({

		///////////////////////////
		// MAIN PLUGIN  FUNCTION //
		///////////////////////////
		showbizpro: function(options) {

				jQuery.fn.showbizpro.defaults = {
					entrySizeOffset:0,
					containerOffsetRight:0,
					heightOffsetBottom:0,
					carousel:"off",
					visibleElementsArray:[4,3,2,1],
					mediaMaxHeight:[0,0,0,0],
					ytMarkup:"<iframe src='http://www.youtube.com/embed/%%videoid%%?hd=1&amp;wmode=opaque&amp;autohide=1&amp;showinfo=0&amp;autoplay=1'></iframe>",
					vimeoMarkup:"<iframe src='http://player.vimeo.com/video/%%videoid%%?title=0&amp;byline=0&amp;portrait=0;api=1&amp;autoplay=1'></iframe>",
					closeOtherOverlays:"off",
					allEntryAtOnce:"off",
					dragAndScroll:"off",
					autoPlay:"off",
					delay:3000,
					speed:300,
					rewindFromEnd:"off",
					easing:"Power3.easeOut",
					forceFullWidth:false,
					scrollOrientation:"left"
					

				};

				options = jQuery.extend({}, jQuery.fn.showbizpro.defaults, options);


				return this.each(function() {

					var container=jQuery(this);

					if (options.forceFullWidth==true) {
							
							var loff = container.offset().left;
							var mb = container.css('marginBottom');
							var mt = container.css('marginTop');
							if (mb==undefined) mb=0;
							if (mt==undefined) mt=0;							
							
							container.wrap('<div style="position:relative;width:100%;height:auto;margin-top:'+mt+';margin-bottom:'+mb+'" class="forcefullwidth_wrapper_tp_banner"></div>');
							container.closest('.forcefullwidth_wrapper_tp_banner').append('<div class="tp-fullwidth-forcer" style="width:100%;height:'+container.height()+'px"></div>');
							container.css({'maxWidth':'none','left':(0-loff)+"px",position:'absolute','width':jQuery(window).width()});
							
						}


					// SAVE THE DEFAULT OPTIONS
					container.data('eoffset',options.entrySizeOffset);
					container.data('croffset',options.containerOffsetRight);
					container.data('hboffset',options.heightOffsetBottom);

					container.data('ease',options.easing);
					if (options.carousel=="on")
						container.data('carousel',1)
					else
						container.data('carousel',0);

					container.data('ytmarkup',options.ytMarkup);
					container.data('vimeomarkup',options.vimeoMarkup);
					container.data('vea',options.visibleElementsArray);
					container.data('coo',options.closeOtherOverlays);
					container.data('allentry',options.allEntryAtOnce);
					container.data('mediaMaxHeight',options.mediaMaxHeight);
					container.data('das',options.dragAndScroll);
					container.data('rewindfromend',options.rewindFromEnd);
					container.data('forceFullWidth',options.forceFullWidth)
					container.data('scrollOrientation',options.scrollOrientation)					
					
					
					container.data('currentoffset',0)

					options.speed = parseInt(options.speed,0);
					options.delay = parseInt(options.delay,0);

					container.data('speedy',options.speed);
					container.data('ie',!jQuery.support.opacity);
					container.data('ie9',(document.documentMode == 9));

					// CHECK THE jQUERY VERSION
					var version = jQuery.fn.jquery.split('.'),
						versionTop = parseFloat(version[0]),
						versionMinor = parseFloat(version[1]),
						versionIncrement = parseFloat(version[2] || '0');

					if (versionTop>1) container.data('ie',false);


					// CLONE IF CAROUSEL IS SELECTED, AND ITEM AMOUNT IS NOT ENOUGH
					if (options.carousel=="on") {
						if (container.find('ul').first().find('>li').length<17) {
							container.find('ul').first().find('>li').each(function(i) {
								jQuery(this).clone(true).appendTo(container.find('ul').first())
							});
						}
						if (container.find('ul').first().find('>li').length<17) {
							container.find('ul').first().find('>li').each(function(i) {
								jQuery(this).clone(true).appendTo(container.find('ul').first())
							});
						}
					}


					var tr = container.find('.showbiz');
					tr.attr('id',"sbiz"+Math.round(Math.random()*10000));



					var driftTimer;


					// IF DRAG AND SCROLL FUNCTION IS ACTIVATED....
					if (options.dragAndScroll=="on") {
						// CALL THE SWIPE FUNCTION TO THE ITEM
						tr.find('.overflowholder').overscroll({
								driftTimeout:0,
								direction:'horizontal',
								wheelDirection:'horizontal',
								captureWheel:false
						}).on('overscroll:dragstart',function() {

								container.find('.overflowholder').stop(true);
						}).on('overscroll:driftend',function() {
								container.find('.overflowholder').data('drifting',0);
								scrollOver(container,0)
						}).on('overscroll:driftstart',function() {
								clearTimeout(driftTimer);
								container.find('.overflowholder').data('drifting',1);
						}).on('overscroll:dragend',function() {
								 if (!is_mobile()) {
									  clearTimeout(driftTimer);
									  driftTimer=setTimeout(function() {
											if (container.find('.overflowholder').data('drifting') !=1)
												scrollOver(container,0);
										},50);
								}

						});
					}
					
					//PREPARE NAVIGATION IF NOT EXIST !
					var rndid = Math.round(Math.random()*100000);
					
					if (tr.data('left')==undefined) tr.data('left','sb_left_'+rndid);
					if (tr.data('right')==undefined) tr.data('right','sb_right_'+rndid);
					if (tr.data('play')==undefined) tr.data('play','sb_play_'+rndid);					
	
					var lb = jQuery(tr.data('left'));
					var rb = jQuery(tr.data('right'));
					var pb = jQuery(tr.data('play'));
					

					if (lb==undefined || lb.length==0)
						jQuery('body').append('<a style="display:none" id="'+tr.data('left')+'" class="sb-navigation-left"><i class="sb-icon-left-open"></i></a>');
					if (rb==undefined || rb.length==0)
						jQuery('body').append('<a style="display:none" id="'+tr.data('right')+'" class="sb-navigation-right"><i class="sb-icon-right-open"></i></a>');
					if (pb==undefined || pb.length==0)
						jQuery('body').append('<a style="display:none" id="'+tr.data('play')+'" class="sb-navigation-play"><i class="sb-icon-play sb-playbutton"></i><i class="sb-icon-pause sb-pausebutton"></i></a>');

	
					initTeaserRotator(container,tr);

					// TURN ON / OFF AUTO PLAY
					if (options.autoPlay!="on")  {
						jQuery(container.find('.showbiz').data('play')).remove();
					} else {

						// STart THE AUTOPLAY
						goInterval();

						// COLLECT THE PLAYBUTTON
						var pb = jQuery(container.find('.showbiz').data('play'));

						// HIDE THE PLAY BUTTON NOW
						pb.find('.sb-playbutton').addClass("sb-hidden");

						container.hover(function() {
								container.addClass("hovered")
							},
							function() {
								container.removeClass("hovered")
							});
						pb.click(function() {
							if (pb.hasClass("paused")) {
								goInterval();
								pb.removeClass("paused");
								pb.find('.sb-pausebutton').removeClass("sb-hidden");
								pb.find('.sb-playbutton').addClass("sb-hidden");
							} else {
								stopInterval();
								pb.addClass("paused");
								pb.find('.sb-pausebutton').addClass("sb-hidden");
								pb.find('.sb-playbutton').removeClass("sb-hidden");
							}
						});

					}

					function goInterval() {
						container.data('timer',setInterval(function() {
							if (container.data('scrollOrientation')=="right") {
								var rb = jQuery(container.find('.showbiz').data('left'));
								if (!container.hasClass("hovered")) lbclick(container,rb);	
							} else {
								var rb = jQuery(container.find('.showbiz').data('right'));
								if (!container.hasClass("hovered")) rbclick(container,rb);
							}
						},options.delay));
					}

					function stopInterval() {
					    clearInterval(container.data('timer'));
					}

					// INIT THE REVEAL FUNCTIONS
					initRevealContainer(container,tr);

					// FIT VIDEO SIZES IN DIFFERENT COTAINERS
					try {
						container.find('.mediaholder_innerwrap').each(function() {
							var mw=jQuery(this);
							if (mw.find('iframe').length>0)
								jQuery(this).fitVids();
						});
					} catch(e) {}

					// SOME HOVER EFFECTS
					initHoverAnimations(container);

					/****************************************************
						-	APPLE IPAD AND IPHONE WORKAROUNDS HERE	-
					******************************************************/

					if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
					    jQuery(".reveal_opener, .sb-navigation-left, .sb-navigation-right").click(function(){
					        //we just need to attach a click event listener to provoke iPhone/iPod/iPad's hover event
					        //strange
					    });
					}
				})

			},

		///////////////////////
		// METHODE RESUME    //
		//////////////////////
		showbizredraw: function(option) {
				return this.each(function() {
					// CATCH THE CONTAINER
					var container=jQuery(this);
					var tr = container.find('.showbiz');
					rebuildTeasers(200,container,tr);
				})
		}


	})


		//////////////////
		// IS MOBILE ?? //
		//////////////////
		function is_mobile() {
		    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry','Android', 'webos', ,'iPod', 'iPhone', 'iPad', 'Blackberry', 'BlackBerry'];
			var ismobile=false;
		    for(i in agents) {

			    if (navigator.userAgent.split(agents[i]).length>1)
		            ismobile = true;

		    }
		    return ismobile;
		}

		////////////////////////////
		// INIT HOVER ANINATIONS //
		////////////////////////////
		function initHoverAnimations(container) {

			container.find('.show_on_hover, .hovercover').each(function() {

				var li=jQuery(this).closest('li');
				
				TweenLite.to(jQuery(this),0.2,{opacity:0,overwrite:"all",ease:Power3.easeInOut});

				li.hover(function() {

					jQuery(this).find('.show_on_hover, .hovercover').each(function() {
						var maxop=1;
						if (jQuery(this).data('maxopacity')!=undefined) maxop=jQuery(this).data('maxopacity');

						TweenLite.to(jQuery(this),0.2,{opacity:maxop,overwrite:"all",ease:Power3.easeInOut});
						
					})
				},
				function() {
					jQuery(this).find('.show_on_hover, .hovercover').each(function() {
						TweenLite.to(jQuery(this),0.2,{opacity:0,ease:Power3.easeInOut});
					})

				});
			})
		}



		////////////////////////////
		// INIT REVEAL ITEMS HERE //
		////////////////////////////
		function initRevealContainer(container,tr) {

		    container.find('.excerpt').each(function() {
			    var ex=jQuery(this);
			    ex.closest('li').hover(function() {

				    ex.slideDown(300);
			    },
			    function() {
			    	ex.stop(true);
				    ex.slideUp(300);
			    })
		    })
			container.find('.reveal_opener').each(function() {
				var ro=jQuery(this);
				ro.click(function() {

					// IDENTIFICATE WHERE THE REVEAL CONTAINER IS
					if (ro.parent().hasClass('reveal_container'))
						var rop = ro.parent();
					else
						var rop = ro.parent().find('.reveal_container');

					// CHECK IF OVERLAY OPEN OR CLOSED
					if (rop.hasClass("revactive")) {

						// IF OPENED THEN LET IT CLOSE
						//setTimeout(function() {
							rop.removeClass("revactive");
							ro.removeClass("revactive");
						//},310);



						rop.closest('li').removeClass("revactive");
						TweenLite.fromTo(rop.find('.reveal_wrapper'),0.3,{visibility:"visible",top:"0%",height:"100%",opacity:1},{opacity:0,top:"0%",height:"0%",ease:Power3.easeInOut});


						// REMOVE THE VIDEO CONTAINER CONTENTS
						rop.find('.sb-vimeo-markup, .sb-yt-markup').html("");

						if (rop.hasClass('tofullwidth')) {
							rebuildTeasers(200,container,tr);
							setTimeout(function() {
								rop.appendTo(rop.data('comefrom'));
							},350);
						}
					} else {
					
						// IF IT IS CLOSED, THEN WE NEED TO OPEN IT
						if (rop.hasClass('tofullwidth')) {
					
							rop.data('comefrom',rop.parent());
							rop.data('indexli',rop.closest('li').index());
							rop.appendTo(rop.closest('.showbiz'));
							ro.addClass("revactive");
						}
						
					
						setTimeout(function() {
							// CLOSE ALL OTHER OPENED OVERLAYS
							if (container.data('coo') == "on")
								rop.closest('ul').find('.reveal_opener').each(function(i) {
									if (jQuery(this).hasClass("revactive")) jQuery(this).click();
								})

							rop.addClass("revactive");
							ro.addClass("revactive");
							rop.closest('li').addClass("revactive");
							TweenLite.fromTo(rop.find('.reveal_wrapper'),0.3,{visibility:"visible",height:"0%",top:"0%",opacity:0},{visibility:"visible",top:"0%",height:"100%",opacity:1,ease:Power3.easeInOut});
													

							// AUTO EMBED VIMEO AND YOUTUBE VIDEOS ON DEMAND
							rop.find('.sb-vimeo-markup, .sb-yt-markup').each(function(i) {
								var video = jQuery(this);

								if (video.hasClass("sb-vimeo-markup"))
									var basic = container.data('vimeomarkup');
								else
									var basic = container.data('ytmarkup');


								var vbe=basic.split('%%videoid%%')[0];
								var vaf=basic.split('%%videoid%%')[1];

								var basic= vbe+video.data('videoid')+vaf;


								video.append(basic);

								try{ video.fitVids(); } catch(e) { }
							});


							setTimeout(function() {setRevContHeight(container,tr);},500);
						},100);
					}
				});
			});
		}


		//////////////////////////////////////////////////
		// CALCULATE THE HEIGHT OF THE REVEAL CONTAINER //
		//////////////////////////////////////////////////
		function setRevContHeight(container,tr) {
			var revc=container.find('.tofullwidth.revactive .heightadjuster');

			var ul = tr.find('ul').first();
			var dif = parseInt(revc.parent().css('paddingTop'),0) + parseInt(revc.parent().css('paddingBottom'),0);

			var hbo=0;
			if (container.data('hboffset')!=undefined) hbo=container.data('hboffset');

			var nh = hbo + dif +revc.outerHeight(true);

			TweenLite.to(ul,0.3,{height:nh+"px",ease:Power3.easeInOut});			
			TweenLite.to(ul.parent(),0.3,{height:nh+"px",ease:Power3.easeInOut});	
			var navheight = container.find('.showbiz-navigation').outerHeight(true);		
			
			TweenLite.to(container.closest('.forcefullwidth_wrapper_tp_banner'),0.3,{height:(nh+navheight)+"px",ease:Power3.easeInOut});
		}


		


		////////////////////////
		// LEFT BUTTON CLICK //
		///////////////////////
		function lbclick(container, lb) {

							
							
				var car= container.data('carousel');
				var speedy = container.data('speedy');
				// IF FULLWIDTH REVACTIVE IS ALREADY ON
				if (container.find('.tofullwidth.revactive .heightadjuster').length>0) {
					var activerev_index=container.find('.tofullwidth.revactive').data('indexli');
					var newindex=activerev_index;
					if (newindex<=0) newindex=container.find('ul:first-child li').length;
					container.find('.tofullwidth.revactive').addClass("sb-removemesoon");
					setTimeout(function() {
						container.find('.tofullwidth.revactive.sb-removemesoon .reveal_opener').click();
						container.find('.sb-removemesoon').each(function() {jQuery(this).removeClass('sb-removemesoon');});
					},350);

					container.find('ul:first-child li:nth-child('+newindex+')').find('.reveal_opener').click();

				}  else {
						
							var tr=lb.data('teaser');
							var ul = tr.find('ul').first();

							if (container.data('das') == "on") {
								scrollOver(container,-1);
							} else {
									var off = container.data('currentoffset');
									var moveit=1;
									var di=container.width();

									if (container.data('allentry')=="on") {
											if (di>980)  { moveit=container.data('vea')[0]; }
											if (di<981 && di>768)  { moveit=container.data('vea')[1];}
											if (di<769 && di>420)  { moveit=container.data('vea')[2]; }
											if (di<421)  { moveit=container.data('vea')[3]; }
										}
									off = off - moveit;
									container.data('currentoffset',off);
									rebuildTeasers(speedy,container,tr);
							}
				}
				
				

					

		}

		////////////////////////
		// RIGHT BUTTON CLICK //
		///////////////////////
		function rbclick(container,rb) {

				var car= container.data('carousel');
				var speedy = container.data('speedy');
				
				// IF FULLWIDTH REVACTIVE IS ALREADY ON
				if (container.find('.tofullwidth.revactive .heightadjuster').length>0) {

					var activerev_index=container.find('.tofullwidth.revactive').data('indexli');
					var newindex=activerev_index+2;
					if (newindex>container.find('ul:first-child li').length) newindex=1;
					container.find('.tofullwidth.revactive').addClass("sb-removemesoon");
					setTimeout(function() {
						container.find('.tofullwidth.revactive.sb-removemesoon .reveal_opener').click();
						container.find('.sb-removemesoon').each(function() {jQuery(this).removeClass('sb-removemesoon');});
					},350);

					container.find('ul:first-child li:nth-child('+newindex+')').find('.reveal_opener').click();


				} else {
							
							var tr=jQuery(rb.data('teaser'));
							var ul = tr.find('ul').first();
							var maxitem=ul.find('>li').length;
							
							// IF DRAG AND SCROLL FUNCTION ACTIVATED
							if (container.data('das') == "on") {
								scrollOver(container,1);

							} else {

									var off = container.data('currentoffset');
									var moveit=1;
									var di=container.width();

									if (container.data('allentry')=="on") {
											if (di>980)  { moveit=container.data('vea')[0]; }
											if (di<981 && di>768)  { moveit=container.data('vea')[1];}
											if (di<769 && di>420)  { moveit=container.data('vea')[2]; }
											if (di<421)  { moveit=container.data('vea')[3]; }
										}
									off = off + moveit;

									container.data('currentoffset',off);
									rebuildTeasers(speedy,container,tr);
																											
							}						 
							
												
				 }
				 

		}

		///////////////////////////////////////
		// FUNCTION HOVER ON SQUARE ELEMENTS //
		///////////////////////////////////////
		function initTeaserRotator(container,tr) {

			var car= container.data('carousel');

			/** THE RATING STARS SHOULD BE SHOWN AS STARTS **/
			container.find('.rating-star').each(function() {
				var wcr=jQuery(this);
				if (wcr.data('rates')!=undefined) {
					var rated=wcr.data('rates');
					wcr.append('<div class="sb-rateholder"></div>');
					for (var i=1;i<6;i++) {
						var wwi=100;
					 if (rated==0) {
						 wwi=0;
					 } else {
						if (rated>=i)
						    wwi=100;
						else {
						   wwi = (rated - Math.floor(rated)) * 100;
						   if ((i-rated)>1) wwi=0;

						 }
					}
						wcr.find('.sb-rateholder').append('<div class="sb-rateholder-single"><div style="width:'+wwi+'%;overflow:hidden"><i class="sb-icon-star"></i></div><i class="sb-icon-star-empty"></i></div>');
					}
					wcr.find('.sb-rateholder').append('<div class="sb-clear"></div>');
				}
			});


			var lb = jQuery(tr.data('left'));
			var rb = jQuery(tr.data('right'));

			var di = container.width();

			lb.data('teaser',tr);
			rb.data('teaser',tr);
			tr.data('offset',0);

			rebuildTeasers(0,container,tr);

			container.find('img').each(function() {
				jQuery(this).parent().waitForImages(function() {
					rebuildTeasers(200,container,tr);

				});
			})


			// THE RIGHT CLICK EVENT ON TEASER ROTATOR
			// THE LEFT CLICK EVENT ON TEASER ROTATOR
			rb.click(function() {
				rbclick(container,rb);
				 return false;
			});

			// THE LEFT CLICK EVENT ON TEASER ROTATOR
			lb.click(function() {
				lbclick(container,lb);
				return false;
			});


			if (container.data('das')!="on")
				container.swipe( {data:container,
											swipeRight:function()
													{

														lb.click();
													},
											swipeLeft:function()
													{

														rb.click();
													},
											excludedElements:".reveal_opener, a,  .linkicon, .notalone, .lupeicon, .hovercover, .showbiz-navigation, .sb-navigation-left, .sb-navigation-right",
										allowPageScroll:"auto"} );



			var timeouts;



			// IF WINDOW IS RESIZED, TEASER SHOUL REPOSITION ITSELF
			jQuery(window).resize(function() {
				clearTimeout(timeouts);
				container.addClass("hovered")
				timeouts= setTimeout(function() {
					   if (container.data('forceFullWidth')==true) {

												var loff = container.closest('.forcefullwidth_wrapper_tp_banner').offset().left;
												//opt.container.parent().css({'width':jQuery(window).width()});
												container.css({'left':(0-loff)+"px",'width':jQuery(window).width()});
											}
											
					   rebuildTeasers(300,container,tr);
					   if (container.data('das')=="on") {
							setTimeout(function() { scrollOver(container,0); },300);
						}
						container.removeClass("hovered")
				},150);
			});


			for (var j=0;j<3;j++) {
				jQuery(window).data('teaserreset',setTimeout(function() {
					rebuildTeasers(200,container,tr);
				},j*500));
			}



		}


		///////////////////////////////////////////////////
		//	FUNCTION TO SCROLL DRAG & SCROLL IN POSITION //
		//////////////////////////////////////////////////
		function scrollOver(container,offset) {

				var tr=container;					// THE CONTAINER VARIABLE
				var di = container.width();			// WIDTH OF THE CONTAINER

				var ul = tr.find('ul').first();				// THE SCROLLED LIST

				var maxitem=ul.find('>li').length;	// THE AMOUNT OF THE LI ITEMS
				var visibleamount =4;				// CURRENT VISIBLE AMOUNTS

				// LETS CHECK HOW MANY ITEMS WE CAN SEE IN THE SAME TIME
				if (di>980)  visibleamount=container.data('vea')[0];
				if (di<981 && di>768) visibleamount=container.data('vea')[1];
				if (di<769 && di>420) visibleamount=container.data('vea')[2];
				if (di<421)  visibleamount=container.data('vea')[3];

				// WHICH IS THE LAST ITEM ON THE LEFT SITE AFTER THE SCROLL
				var lastlefitem = maxitem-visibleamount;

				// THE WIDTH OF THE LI'S
				var wid = ul.find('>li:first-child').outerWidth(true);


				var ofh = tr.find('.overflowholder')		//THE OVERFLOW HOLDER, THE CONTAINER PARENT FOR SCROLL
				var csp = ofh.scrollLeft();					// THE CURRENT SCROLL POSITION OF THIS CONTAINER
				var cip = Math.round(csp/wid);				// AT WHICH ITEM WE STAY ??

				var rb=jQuery(ofh.parent().data('right'));
				var lb=jQuery(ofh.parent().data('left'));


				var scrollto = (cip+offset)*wid;			// WHERE TO SCROLL
				if (scrollto>=(lastlefitem*wid)) {
					scrollto = (lastlefitem*wid);			// IF TO FAR WE NEED TO SCROLL BACK
					try{ rb.addClass('notclickable'); } catch(e) {}
				} else {
					try{ rb.removeClass('notclickable'); } catch(e) {}
				}

				if (scrollto<=0) {
					scrollto = 0;							// IF TO FAR WE NEED TO SCROLL BACK
					try{ lb.addClass('notclickable'); } catch(e) {}
				} else {
					try{ lb.removeClass('notclickable'); } catch(e) {}
				}

				ofh.animate({scrollLeft:scrollto+'px'},{duration:300,queue:false, complete:function() {ofh.removeClass("inmove")}});

		};



		/////////////////////////////////////////////////////
		// FUNCTION TO REPOSITION AND REBUILD THE TEASERS //
		////////////////////////////////////////////////////

		function rebuildTeasers(speed,container,tr) {

					var car= container.data('carousel');
					var ul = tr.find('ul');
					var off =container.data('currentoffset');					
					var di = container.width();
					var padds = parseInt(tr.css('paddingLeft'),0) + parseInt(tr.css('paddingRight'),0);
					di=di-padds;



					var ul = tr.find('ul:first');
					maxitem=ul.find('>li').length;
					var rb=jQuery(tr.data('right'));
					if (container.data('das')!="on") rb.removeClass('notclickable');

					var lb=jQuery(tr.data('left'));
					if (container.data('das')!="on")  lb.removeClass('notclickable');

					var visibleamount=container.data('vea')[0];
					var marray=container.data('mediaMaxHeight');

					if (di>980)  {
						visibleamount=container.data('vea')[0];

						try{
								if (marray[0] !=0)
								container.find('.mediaholder_innerwrap').each(function() {
											jQuery(this).css({'maxHeight':marray[0]+"px"});
								});
							} catch(e) {  }
					}
					if (di<981 && di>768)  {
						visibleamount=container.data('vea')[1];
						try{
								if (marray[1] !=0)
								container.find('.mediaholder_innerwrap').each(function() {
											jQuery(this).css({'maxHeight':marray[1]+"px"});
								});
							} catch(e) {  }
					}
					if (di<769 && di>420)  {
						visibleamount=container.data('vea')[2];
						try{
								if (marray[2] !=0)
								container.find('.mediaholder_innerwrap').each(function() {
											jQuery(this).css({'maxHeight':marray[2]+"px"});
								});
							} catch(e) {  }

					}
					if (di<421)  {
						visibleamount=container.data('vea')[3];
						try{
								if (marray[3] !=0)
								container.find('.mediaholder_innerwrap').each(function() {
											jQuery(this).css({'maxHeight':marray[3]+"px"});
								});
							} catch(e) {  }
					}


					var space = ul.find('>li:first-child').outerWidth(true) - ul.find('>li:first-child').width();
					var eo=0;
					if (container.data('eoffset')!=undefined) eo=container.data('eoffset') * (visibleamount-1);
					var cro=0;
					if (container.data('croffset')!=undefined) cro=container.data('croffset');				
					step=(di-((visibleamount-1)*space)) / visibleamount;
					step=Math.round(step-eo);
					
					var newWidth = false;
					ul.find('>li').each(function() { 
						if (jQuery(this).width() != step) newWidth = true;
						jQuery(this).width(step);
						 
					});

					ul.css({'width':'40000px'});
					
					var mrDelay=0;
					if (newWidth) mrDelay = 450;

					var easeMe = container.data('ease');
					
					setTimeout(function() {

						step=ul.find('li:first').outerWidth(true);
						var stepxoff=(step*off);
						if (stepxoff<0) stepxoff =0;
						var mrdelay=0;
						var distance = (maxitem*step) - di;
						var lastpos = (stepxoff+space)
					
						if (car!=1) {
								// CHECK IF LAST ITEM HAS BEEN REACHED IF CAROUSEL NOT TURNED OFF
								if ((distance) <= lastpos && off>1) {
									
									if (container.data('rewindfromend')=="on") {

										if (distance < lastpos) {
											stepxoff=0;
											container.data('currentoffset',0);
										} 
									} else {
										container.data('currentoffset',maxitem-visibleamount);
										stepxoff=(step*(maxitem-visibleamount));
										rb.addClass("notclickable");
									}
								}
								
								if (off<=0) {
									if (container.data('rewindfromend')=="on") {
										if (off<0) {
											container.data('currentoffset',maxitem-visibleamount);
											stepxoff=(step*(maxitem-visibleamount));
										}
									} else {
										stepxoff=0;
										container.data('currentoffset',0);
										lb.addClass("notclickable");
									}
								}
								if (isIE(8))
									TweenLite.to(ul,speed/1000,{left:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});						
								else
									TweenLite.to(ul,speed/1000,{x:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});															
								
						} else {
								if ((distance) <= lastpos) {
									off = off-2;

									container.data('currentoffset',off+1);
									stepxoff=(step*off);																		
									ul.find('>li').first().appendTo(ul);
									if (isIE(8))
										TweenLite.set(ul,{left:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});						
									else								
										TweenLite.set(ul,{x:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});						
									off = off+1;
									stepxoff=(step*off);																											

								}
								
								if (off < 0) {
									off = 1;
									container.data('currentoffset',0);
									stepxoff=(step*off);																		
									ul.find('>li').last().prependTo(ul);
									if (isIE(8)) 
										TweenLite.set(ul,{left:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});															
									else 
										TweenLite.set(ul,{x:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});						
									off = 0;
									stepxoff=(step*off);																											

								}
								if (isIE(8)) 
									TweenLite.to(ul,speed/1000,{left:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});						
								else 
									TweenLite.to(ul,speed/1000,{x:(0-stepxoff)+"px",transformPerspective:300,ease:easeMe});						

						}
		
						
					},mrDelay)
				

													
					// SET THE HEIGHTS OF THE OUTTER CONTIANER

					var hbo=0;
					if (container.data('hboffset')!=undefined) hbo=container.data('hboffset');
					setTimeout(function() {
							var aktheight=0;
							ul.find('li').each(function(){
									if (jQuery(this).outerHeight(true)>aktheight) aktheight=jQuery(this).outerHeight(true);
							});
							setTimeout(function() {

								if (step>100) {
									var last=ul.find('>li:last-child');
									var secnd= ul.find('>li:nth(2)');						
									var w=(last.index()+1)*last.outerWidth(true)+space;
									ul.css({'width':w+"px"});
								}
							},200);

							if (container.find('.tofullwidth.revactive .heightadjuster').length>0) {

								setRevContHeight(container,tr)
							} else {

									TweenLite.to(ul,0.3,{height:(aktheight+hbo)+"px",ease:Power3.easeInOut});
									TweenLite.to(ul.parent(),0.3,{height:(aktheight+hbo)+"px",ease:Power3.easeInOut});		
									var navheight = container.find('.showbiz-navigation').outerHeight(true);

									TweenLite.to(container.closest('.forcefullwidth_wrapper_tp_banner'),0.3,{height:(aktheight+hbo+navheight)+"px",ease:Power3.easeInOut});

							
							}


					 },speed+210)


		}
		
		/*********************************
			-	CHECK IF BROWSER IS IE	-
		********************************/		
		function isIE( version, comparison ){
		    var $div = jQuery('<div style="display:none;"/>').appendTo(jQuery('body'));
		    $div.html('<!--[if '+(comparison||'')+' IE '+(version||'')+']><a>&nbsp;</a><![endif]-->');
		    var ieTest = $div.find('a').length;
		    $div.remove();
		    return ieTest;
		}




}(jQuery));

/**
 * Overscroll v1.7.3
 *  A jQuery Plugin that emulates the iPhone scrolling experience in a browser.
 *  http://azoffdesign.com/overscroll
 *
 * Intended for use with the latest jQuery
 *  http://code.jquery.com/jquery-latest.js
 *  
 * Copyright 2013, Jonathan Azoff
 * Licensed under the MIT license.
 *  https://github.com/azoff/overscroll/blob/master/mit.license
 *
 * For API documentation, see the README file
 *  http://azof.fr/pYCzuM
 *
 * Date: Tuesday, March 18th 2013
 */
 
(function(e,t,n,r,i,s,o,u,a){"use strict";jQuery(document).ready(function(){function p(e,t){t.trigger("overscroll:"+e)}function d(){return(new Date).getTime()}function v(e,t,n){t.x=e.pageX;t.y=e.pageY;t.time=d();t.index=n;return t}function m(e,t,n,r){var i,s;if(e&&e.added){if(e.horizontal){i=n*(1+t.container.width/t.container.scrollWidth);s=r+t.thumbs.horizontal.top;e.horizontal.css("margin",s+"px 0 0 "+i+"px")}if(e.vertical){i=n+t.thumbs.vertical.left;s=r*(1+t.container.height/t.container.scrollHeight);e.vertical.css("margin",s+"px 0 0 "+i+"px")}}}function g(e,t,n){if(e&&e.added&&!t.persistThumbs){if(n){if(e.vertical){e.vertical.stop(true,true).fadeTo("fast",c.thumbOpacity)}if(e.horizontal){e.horizontal.stop(true,true).fadeTo("fast",c.thumbOpacity)}}else{if(e.vertical){e.vertical.fadeTo("fast",0)}if(e.horizontal){e.horizontal.fadeTo("fast",0)}}}}function y(e){var t,n="events";var r=u._data?u._data(e[0],n):e.data(n);if(r&&r.click){t=r.click.slice();e.off("click").one("click",function(){u.each(t,function(t,n){e.click(n)});return false})}}function b(e){var t=e.data,n=t.thumbs,r=t.options,i=e.type==="mouseenter";g(n,r,i)}function w(e){var t=e.data;if(!t.flags.dragged){m(t.thumbs,t.sizing,this.scrollLeft,this.scrollTop)}}function E(e){e.preventDefault();var t=e.data,r=t.options,o=t.sizing,u=t.thumbs,a=t.wheel,f=t.flags,l=e.originalEvent,h=0,p=0,d=0;f.drifting=false;if(l.detail){h=-l.detail;if(l.detailX){p=-l.detailX}if(l.detailY){d=-l.detailY}}else if(l.wheelDelta){h=l.wheelDelta/c.wheelTicks;if(l.wheelDeltaX){p=l.wheelDeltaX/c.wheelTicks}if(l.wheelDeltaY){d=l.wheelDeltaY/c.wheelTicks}}h*=r.wheelDelta;p*=r.wheelDelta;d*=r.wheelDelta;if(!a){t.target.data(n).dragging=f.dragging=true;t.wheel=a={timeout:null};g(u,r,true)}if(r.wheelDirection==="vertical"){this.scrollTop-=h}else if(r.wheelDirection==="horizontal"){this.scrollLeft-=h}else{this.scrollLeft-=p;this.scrollTop-=d||h}if(a.timeout){s(a.timeout)}m(u,o,this.scrollLeft,this.scrollTop);a.timeout=i(function(){t.target.data(n).dragging=f.dragging=false;g(u,r,t.wheel=null)},c.thumbTimeout)}function S(e){e.preventDefault();var t=e.data,r=e.originalEvent.touches,i=t.options,s=t.sizing,o=t.thumbs,u=t.position,a=t.flags,f=t.target.get(0);if(r&&r.length){e=r[0]}if(!a.dragged){g(o,i,true)}a.dragged=true;if(i.direction!=="vertical"){f.scrollLeft-=e.pageX-u.x}if(t.options.direction!=="horizontal"){f.scrollTop-=e.pageY-u.y}v(e,t.position);if(--t.capture.index<=0){t.target.data(n).dragging=a.dragging=true;v(e,t.capture,c.captureThreshold)}m(o,s,f.scrollLeft,f.scrollTop)}function x(e,t,n){var r=t.data,i,s,o,u,a=r.capture,l=r.options,h=r.sizing,v=r.thumbs,g=d()-a.time,y=e.scrollLeft,b=e.scrollTop,w=c.driftDecay;if(g>c.driftTimeout){n(r);return}i=l.scrollDelta*(t.pageX-a.x);s=l.scrollDelta*(t.pageY-a.y);if(l.direction!=="vertical"){y-=i}if(l.direction!=="horizontal"){b-=s}o=i/c.driftSequences;u=s/c.driftSequences;p("driftstart",r.target);r.drifting=true;f.animate(function E(){if(r.drifting){var t=1,i=-1;r.drifting=false;if(u>t&&e.scrollTop>b||u<i&&e.scrollTop<b){r.drifting=true;e.scrollTop-=u;u/=w}if(o>t&&e.scrollLeft>y||o<i&&e.scrollLeft<y){r.drifting=true;e.scrollLeft-=o;o/=w}m(v,h,e.scrollLeft,e.scrollTop);f.animate(E)}else{p("driftend",r.target);n(r)}})}function T(e){var t=e.data,r=e.originalEvent.touches,i=t.target,s=t.start=u(e.target),o=t.flags;o.drifting=false;if(s.size()&&!s.is(t.options.cancelOn)){if(!r){e.preventDefault()}if(!f.overflowScrolling){i.css("cursor",f.cursor.grabbing);i.data(n).dragging=o.dragging=o.dragged=false;if(t.options.dragHold){u(document).on(l.drag,t,S)}else{i.on(l.drag,t,S)}}t.position=v(e,{});t.capture=v(e,{},c.captureThreshold);p("dragstart",i)}}function N(e){var t=e.data,r=t.target,i=t.options,s=t.flags,o=t.thumbs,a=function(){if(o&&!i.hoverThumbs){g(o,i,false)}};if(i.dragHold){u(document).unbind(l.drag,S)}else{r.unbind(l.drag,S)}if(t.position){p("dragend",r);if(s.dragging&&!f.overflowScrolling){x(r.get(0),e,a)}else{a()}}if(s.dragging&&!f.overflowScrolling&&t.start&&t.start.is(e.target)){y(t.start)}r.data(n).dragging=t.start=t.capture=t.position=s.dragged=s.dragging=false;r.css("cursor",f.cursor.grab)}function C(e){e=u.extend({},h,e);if(e.direction!=="multi"&&e.direction!==e.wheelDirection){e.wheelDirection=e.direction}e.scrollDelta=r.abs(parseFloat(e.scrollDelta));e.wheelDelta=r.abs(parseFloat(e.wheelDelta));e.scrollLeft=e.scrollLeft===a?null:r.abs(parseFloat(e.scrollLeft));e.scrollTop=e.scrollTop===a?null:r.abs(parseFloat(e.scrollTop));return e}function k(e){var t=u(e),n=t.width(),r=t.height(),i=n>=e.scrollWidth?n:e.scrollWidth,s=r>=e.scrollHeight?r:e.scrollHeight,o=i>n||s>r;return{valid:o,container:{width:n,height:r,scrollWidth:i,scrollHeight:s},thumbs:{horizontal:{width:n*n/i,height:c.thumbThickness,corner:c.thumbThickness/2,left:0,top:r-c.thumbThickness},vertical:{width:c.thumbThickness,height:r*r/s,corner:c.thumbThickness/2,left:n-c.thumbThickness,top:0}}}}function L(e,t){var r=u(e),i,s=r.data(n)||{},o=r.attr("style"),a=t?function(){s=r.data(n);i=s.thumbs;if(o){r.attr("style",o)}else{r.removeAttr("style")}if(i){if(i.horizontal){i.horizontal.remove()}if(i.vertical){i.vertical.remove()}}r.removeData(n).off(l.wheel,E).off(l.start,T).off(l.end,N).off(l.ignored,M)}:u.noop;return u.isFunction(s.remover)?s.remover:a}function A(e,t){return{position:"absolute",opacity:t.persistThumbs?c.thumbOpacity:0,"background-color":"black",width:e.width+"px",height:e.height+"px","border-radius":e.corner+"px",margin:e.top+"px 0 0 "+e.left+"px","z-index":t.zIndex}}function O(e,t,n){var r="<div/>",i={},s=false;if(t.container.scrollWidth>0&&n.direction!=="vertical"){s=A(t.thumbs.horizontal,n);i.horizontal=u(r).css(s).prependTo(e)}if(t.container.scrollHeight>0&&n.direction!=="horizontal"){s=A(t.thumbs.vertical,n);i.vertical=u(r).css(s).prependTo(e)}i.added=!!s;return i}function M(e){e.preventDefault()}function _(e,t){t=C(t);var r=k(e),i,s={options:t,sizing:r,flags:{dragging:false},remover:L(e,true)};if(r.valid||t.ignoreSizing){s.target=e=u(e).css({position:"relative",cursor:f.cursor.grab}).on(l.start,s,T).on(l.end,s,N).on(l.ignored,s,M);if(t.dragHold){u(document).on(l.end,s,N)}else{s.target.on(l.end,s,N)}if(t.scrollLeft!==null){e.scrollLeft(t.scrollLeft)}if(t.scrollTop!==null){e.scrollTop(t.scrollTop)}if(f.overflowScrolling){e.css(f.overflowScrolling,"touch")}else{e.on(l.scroll,s,w)}if(t.captureWheel){e.on(l.wheel,s,E)}if(t.showThumbs){if(f.overflowScrolling){e.css("overflow","scroll")}else{e.css("overflow","hidden");s.thumbs=i=O(e,r,t);if(i.added){m(i,r,e.scrollLeft(),e.scrollTop());if(t.hoverThumbs){e.on(l.hover,s,b)}}}}else{e.css("overflow","hidden")}e.data(n,s)}}function D(e){L(e)()}function P(e){return this.removeOverscroll().each(function(){_(this,e)})}function H(){return this.each(function(){D(this)})}var n="overscroll";if(t.body===null){t.documentElement.appendChild(t.createElement("body"))}if(!e.getComputedStyle){e.getComputedStyle=function(e,t){this.el=e;this.getPropertyValue=function(t){var n=/(\-([a-z]){1})/g;if(t=="float")t="styleFloat";if(n.test(t)){t=t.replace(n,function(){return arguments[2].toUpperCase()})}return e.currentStyle[t]?e.currentStyle[t]:null};return this}}var f={animate:function(){var t=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(e){i(e,1e3/60)};return function(n){t.call(e,n)}}(),overflowScrolling:function(){var n="";var r=t.createElement("div");var i=["webkit","moz","o","ms"];t.body.appendChild(r);u.each(i,function(e,t){r.style[t+"OverflowScrolling"]="touch"});r.style.overflowScrolling="touch";var s=e.getComputedStyle(r);if(!!s.overflowScrolling){n="overflow-scrolling"}else{u.each(i,function(e,t){if(!!s[t+"OverflowScrolling"]){n="-"+t+"-overflow-scrolling"}return!n})}r.parentNode.removeChild(r);return n}(),cursor:function(){var n=t.createElement("div");var r=["webkit","moz"];var i="https://mail.google.com/mail/images/2/";var s={grab:"url("+i+"openhand.cur), move",grabbing:"url("+i+"closedhand.cur), move"};t.body.appendChild(n);u.each(r,function(t,r){var i,o="-"+r+"-grab";n.style.cursor=o;var u=e.getComputedStyle(n);i=u.cursor===o;if(i){s={grab:"-"+r+"-grab",grabbing:"-"+r+"-grabbing"}}return!i});n.parentNode.removeChild(n);return s}()};var l={drag:"mousemove touchmove",end:"mouseup mouseleave click touchend touchcancel",hover:"mouseenter mouseleave",ignored:"select dragstart drag",scroll:"scroll",start:"mousedown touchstart",wheel:"mousewheel DOMMouseScroll"};var c={captureThreshold:3,driftDecay:1.1,driftSequences:22,driftTimeout:100,scrollDelta:15,thumbOpacity:.7,thumbThickness:6,thumbTimeout:400,wheelDelta:20,wheelTicks:120};var h={cancelOn:"select,input,textarea",direction:"multi",dragHold:false,hoverThumbs:false,scrollDelta:c.scrollDelta,showThumbs:true,persistThumbs:false,captureWheel:true,wheelDelta:c.wheelDelta,wheelDirection:"multi",zIndex:999,ignoreSizing:false};P.settings=c;u.extend(o,{overscroll:P,removeOverscroll:H})})})(window,document,navigator,Math,setTimeout,clearTimeout,jQuery.fn,jQuery);


/* FITVIDS */
(function(e,t){
		e.fn.fitVids=function(t){var n={customSelector:null};var r=document.createElement("div"),i=document.getElementsByTagName("base")[0]||document.getElementsByTagName("script")[0];r.className="fit-vids-style";r.innerHTML="­<style>               .fluid-width-video-wrapper {                 width: 100%;                              position: relative;                       padding: 0;                            }                                                                                   .fluid-width-video-wrapper iframe,        .fluid-width-video-wrapper object,        .fluid-width-video-wrapper embed {           position: absolute;                       top: 0;                                   left: 0;                                  width: 100%;                              height: 100%;                          }                                       </style>";i.parentNode.insertBefore(r,i);if(t){e.extend(n,t)}return this.each(function(){var t=["iframe[src*='player.vimeo.com']","iframe[src*='www.youtube.com']","iframe[src*='www.kickstarter.com']","object","embed"];if(n.customSelector){t.push(n.customSelector)}var r=e(this).find(t.join(","));r.each(function(){var t=e(this);if(this.tagName.toLowerCase()=="embed"&&t.parent("object").length||t.parent(".fluid-width-video-wrapper").length){return}var n=this.tagName.toLowerCase()=="object"?t.attr("height"):t.height(),r=n/t.width();if(!t.attr("id")){var i="fitvid"+Math.floor(Math.random()*999999);t.attr("id",i)}t.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",r*100+"%");t.removeAttr("height").removeAttr("width")})})}
})(jQuery)

var Cover = {

  onlyChrome: true,
  isChrome:false,
  isBgBlur: true,
  animDuration: 500,
  
  title:"Add title",
  description:"Add description",
  btnLabel:"Explore",

  setup: function ( props ) {
    
    console.log("setup");

    this.title = props.title? props.title : "This is a title";
    this.description = props.description? props.description : "This is a title";
    this.btnLabel = props.actionLabel? props.actionLabel : "Explore";

    $("body").prepend('<div class="cover"><div class="middle"><div class="brand"><div class="logo"></div><div class="present">The <span class="black">Data Storytelling Group</span> present</div></div><div class="title bold"><span class="italic">'+ this.title +'</div><div class="description">'+this.description+'</div><div class="action-container"><div class="explore">'+this.btnLabel+'</div><div class="loading">Loading data</div><div class="chrome"><div class="warning"></div>This visualization is only available on <a href="https://www.google.com/chrome/browser/desktop/">Google Chrome</a>. Please, change your browser to continue.</div></div></div></div>')
    
    this.onlyChrome = props.onlyChrome? props.onlyChrome : false; // Check if is google chrome only
    this.isChrome = this.isGoogleChrome();

    if( this.onlyChrome && !this.isChrome ){ 
      $('.chrome').show();
      $('.loading').hide();
      $('.explore').hide();
    }

    // Show loading progress
    else {
      $('.loading').show();
      $('.chrome').hide();
      $('.explore').hide();
    }

    $('.explore').on('click', this.close );

  },

  open: function () {
    $('.cover').fadeIn(this.animDuration);
    if (this.isBgBlur) $('.viz-wrapper').addClass('blur');
  },

  close: function () {
    $('.cover').fadeOut(this.animDuration);
    if (this.isBgBlur) $('.viz-wrapper').removeClass('blur');
  },

  contentLoaded: function () {

    console.log("is this chrome? ", this.isChrome );

    if( this.onlyChrome && !this.isChrome ){
      $('.chrome').show();
      $('.explore').hide();
      $('.loading').hide();
    }
    else {
      console.log("Is chrome!")
      $('.explore').show().fadeIn(300);
      $('.loading').hide();
    }
    
  },

  isGoogleChrome: function () {
    return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  }

}


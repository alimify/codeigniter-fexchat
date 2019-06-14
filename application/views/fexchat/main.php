<!DOCTYPE html>

<html>

    <head>

    <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <!--<meta name="viewport" content="width=device-width, initial-scale=1">-->

        <script src="http://localhost:9000/socket.io/socket.io.js"></script>

        <title>FexChat</title>

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/uikit.min.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/material-design-iconic-font.min.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/bulma.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/font-awesome.min.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/app.css">
        <link rel="stylesheet" href="<?= base_url() ?>dist/css/nav.min.css">

    </head>

    <body>
        <nav class="f-navbar">
            <div class="container">
                <a href="" class="logo"><img src="<?= base_url() ?>assets/images/logo-w.png" alt=""></a>
                <form action=""><input type="text" placeholder="Search"><button><i class="fa fa-search"></i> Search</button></form>
                <div class="links">
                    <a href="" class="user-link" style="text-transform: uppercase">
                        <img src="<?= base_url() ?>assets/img/sidebar-toggler.png" alt="">
                        <!-- <i class="fa fa-bars"></i> -->
                    </a>
                    <div dropdown>
<?php if($role_id == 5){ ?>
                        <a href="<?= base_url() ?>customer/dashboard">Dashboard</a>
                        <a href="<?= base_url() ?>customer/start-job-posting">Post a Job</a>
                        <a href="<?= base_url() ?>Fexchat">Messages</a>
                        <a href="<?= base_url() ?>customer/my-freelancers">My Freelancer</a>
                        <a href="<?= base_url() ?>customer/open-jobs">Open Jobs</a>
                        <a href="<?= base_url() ?>customer/job-listing">Job Listing</a>
                        <a href="<?= base_url() ?>customer/my-profile">My profile</a>
<?php  }elseif ($role_id == 4 ) { ?>
                        <a href="<?= base_url() ?>professional/dashboard" >My Dashboard</a>
                        <a href="<?= base_url() ?>professional/history-job">Contracts</a>
                        <a href="<?= base_url() ?>professional/my-profile">View Profile</a>
                        <a href="<?= base_url() ?>professional/job-invitation">My Job Invitations</a>
                        <a href="<?= base_url() ?>professional/my-clients">My Clients</a>
                        <a href="<?= base_url() ?>professional/contract-payment">Payments</a>
<?php } ?>
                        <a href="<?= base_url() ?>logout" class="logout"><i class="fa fa-sign-out"></i> Log Out</a>
                    </div>
                </div>
            </div>
        </nav> 

        <!-- App Root -->

        <div class="container root is-fluid">

            <div class="fex-app" style="box-shadow: 0px 0px 3px #d4d4d4" id="parent" draggable="true">



                <!-- Menu Start -->

                <div class="f-menu">



                    <!-- Menu Header Start -->

                    <header class="f-menu-header">

                            <div class="">

                                <figure class="image is-48x48 f-i userIcon is-pulled-right">

                                    <img src="<?= base_url() ?>uploads/profile/<?= $image ?>" alt="Image">

                                </figure>

                            </div>

                            <div class="f mainSetting-parent" style="position: relative;">

                                <div class="buttons has-addons is-centered f-menu-toggle">

                                    <button class="button a active 1" type="button" id="chatListToggle" title="Chats" uk-tooltip="">

                                        <span class="mdi mdi-comment-list"></span>

                                    </button>

                                    <button class="button a 2" type="button" id="contactListToggle" title="Contacts" uk-tooltip="">

                                        <span class="mdi mdi-accounts-list"></span>

                                    </button>

                                    <button class="button" id="mainSetting" title="Settings" uk-tooltip>

                                        <i class="fa fa-gear"></i>

                                    </button>

                                </div>

                                <div class="mainSetting-dropdown">

                                    <a href="#" class="dropdown-item" id="mainSettingModal">Messages Settings

                                      </a>

                                    <a href="#" class="dropdown-item" id="out-of-office-toggle">Out-of-Office

                                      </a>

                                    <a href="#" class="dropdown-item">Help &Tips

                                      </a>

                                    <a href="#" class="dropdown-item">Shortcut Keys

                                      </a>

                                </div>

                            </div>

                    </header>

                    <!-- Menu Header End //-->



                    <!--  Menu Body Start -->

                    <main class="f-menu-main">



                        <!-- Menu Search & New Group Start -->

                        <header class="search-bar">

                            <div class="control has-icons-left">

                                <input class="input" type="search" placeholder="Search" id="mainSearch">

                                <span class="icon is-small is-left" style="top: 13%;">

                                    <i class="fa fa-search"></i>

                                </span>

                            </div>

                            <div style="display:flex">

                                <button class="button" style="align-self:center" id="newGroup" title="New Group" uk-tooltip="">

                                    <i class="fa fa-plus"></i>

                                </button>

                            </div>

                            

                        </header>

                        <!-- Menu Search & New Group End //-->



                        <!-- Menu Chats Listing Start -->

                        <section id="chatList">

                            <div class="f-dropdown">

                                <div class="f-dropdownTrigger" id="msgFilter">All

                                </div>

                                <div class="content">

                                    <a data = 0 href="#" class="dropdown-item active">All

                                  </a>

                                    <a data = 1 href="#" class="dropdown-item">Unread

                                  </a>

                                    <a data = 2 href="#" class="dropdown-item">Contracts Only

                                  </a>

                                    <a data = 3 href="#" class="dropdown-item">Interviews Only

                                  </a>

                                </div>

                            </div>

<div class="uk-align-center"><span uk-spinner="ratio: .8"></span></div>

                        </section>

                        <!-- Menu Chats Listing End //-->



                        <!-- Menu Contacts Listing Starts -->

                        <section id="contactList">

                         

                        </section>

                        <!-- Menu Contacts Listing End //-->



                        <!-- Menu Sidebar Setting Start -->

                        

                        <!-- Menu Sidebar Setting End -->

                        <section id="searchDisplay">

                            <div>Search...</div>

                            <div><span style="display:none;" uk-spinner="ratio: .8"></span> </div>

                        </section>

                        <!-- Search Display -->



                        <!-- Search Display End// -->



                    </main>

                    <!--  Menu Body End //-->

                </div>

                <!-- Menu End //-->



                <!-- Main Start -->

                <div class="f-main">



                    <!-- Chat Display Header -->

                    <header class="f-main-header group-chat">

                        <div class="header box" style="padding-left:1rem">

                            <article class="media">

                                <div class="media-left">

            <div class="uk-align-center"><span uk-spinner="ratio: .8"></span></div>

                                    <!--Here will display Group/user Image -->

                                </div>

                                <div class="name-bar" style="align-self:center;display: none;">

                                    <h4><!-- Here will display username/job title--></h4>

                                    <p>

                                        <span id="group-info" class="cursor" style="position:relative">

                                            <!--<i class="mdi mdi-accounts-outline" style="font-size: 1.35em;vertical-align: text-bottom;"> </i> 5 -->|

                                            

                                        </span>

                                        <span class="view" style="cursor:pointer"> Media</span>

                                        <time><!-- Time And Location --></time>

                                    </p>

                                </div>

                                <div class="group-members">

                                    <div>

                                       <input class="input" type="text" placeholder="Search..">

                                    </div>

                                    <div>

                                        

                                    </div>

                                </div>

                            </article>

                            <div class="view-contract">

                                <button type="button" class="button">View Contract</button>

                            </div>

                        </div>

                        <div>

                            <div class="f-icon">

                                <span class="fa fa-video-camera not-available" style="font-size: 18px" title="Not Available" uk-tooltip></span>

                            </div>

                            <div class="f-icon">

                                <span class="fa fa-phone fa-lg not-available" style="font-size: 20px" title="Not Available" uk-tooltip></span>

                            </div>

                            <div class="f-icon add-to-group-parent" style="position: relative;">

                                <span class="fa fa-user-plus fa-lg cursor" id="add-to-group-display" style="padding: 0.7em .5em .7em .5em;font-size: initial;" title="Add to Group" uk-tooltip></span>

                                <div class="add-to-group">
                                    <div>
                                    <div class="uk-align-center uk-position-center"><span uk-spinner="ratio: .8"></span></div>
                                    <!--Here Will Display Add to Group Data -->

                                    </div>

                                    <div>

                                        <div class="field is-grouped is-pulled-right">

                                            <p class="control">

                                                <a class="button add-to-group-dismiss">Cancel

                                            </a>

                                            </p>

                                            <p class="control">

                                                <a class="button is-link add-to-group-dismiss" style="background-color: var(--fOrange)">Add

                                            </a>

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </header>

                    <!-- Chat Display Header End -->



                    <!-- Chat Display -->

                    <main class="f-main-body" id="mRoot">

                        <div class="date view-more" style="display: none;">

                            <span class="tag">View More</span>

                        </div>

                <div class="uk-align-center spinner-for-msg"><span uk-spinner="ratio: .8"></span></div>

                

                        

                    </main>

                    <!-- Chat Display End -->



                    <!-- Editor Box / Emoji -->
                    <footer id="eRoot">
                        <div id="typing"> </div>
                        <div class="editBox">

                            <div class="editBox-body" style="background-color: #fff">
                                
                                <div class="editor-wraper">

                                    <!-- <div id="editor"></div> -->
                                    <textarea id="editor" placeholder="Type a message" rows="1" autofocus autocomplete=""></textarea>

                                </div>

                                <div class="f-toolbar">

                                    <div id="emojiToggle">

                                        <i class="fa fa-smile-o" title="Insert Emoji" uk-tooltip></i>

                                    </div>

                                    <div id="imageUpload">

                                        <i class="fa fa-file-image-o" title="Selet Image" uk-tooltip></i>

                                    </div>

                                    <div id="allFileUpload">

                                        <i class="fa fa-file-o" title="Select File" uk-tooltip></i>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div id="sendBar">

                            <button class="button is-medium is-left" id="mSendBtn" style="font-size: 1.15rem;">Send</button>

                        </div>

                        <div class="emoji-container">

                            <div class="emoji-header" data-target="emoji-body">

                                <div class="" title="Activity">

                                    <span class="fa fa-clock-o fa-lg"></span>

                                </div>

                                <div class=" active"title="Smilies and People">

                                    <span class="fa fa-smile-o fa-lg"></span>

                                </div>

                                <div class="" title="Animals">

                                    <span>🐶</span>

                                </div>

                                <div class="" title="Foods">

                                    <span>☕️</span>

                                </div>

                                <div class="" title="Games">

                                    <span>⚽️</span>

                                </div>

                                <div class="" title="Transport">

                                    <span class="fa fa-automobile"></span>

                                </div>

                                <div class="" title="Objects">

                                    <span>💡</span>

                                </div>

                                <div class="" title="Symbols">

                                    <span>💝</span>

                                </div>

                                <div class="" title="Flags">

                                    <span class="fa fa-flag-checkered fa-lg"></span>

                                </div>

                            </div>

                            <div class="emoji-body">

                                <div id="e-recent">

                                </div>

                                <div class="emoji-active" id="e-smiley_and_people">

                                </div>

                                <div id="e-animal_and_nature">

                                </div>

                                <div id="e-food_and_drink">

                                </div>

                                <div id="e-activites">

                                </div>

                                <div id="e-travel_and_places">

                                </div>

                                <div id="e-objects">

                                </div>

                                <div id="e-symbols">

                                </div>

                                <div id="e-flags">

                                </div>

                            </div>

                        </div>

                        <div id="upload">

                            <input type="file" name="uploadImage" accept=".jpg, .jpeg, .png, .gif">

                            <input type="file" name="uploadAll">

                        </div>

                    </footer>

                    <!-- Editor Box / Emoji End -->

                </div>

            </div>



            <!-- Modals -->

            <div class="f-modal" id="settingModal">

                <header>

                    <h1 style="display: inline-block;">Message Settings</h1>

                    <span class="is-pulled-right">

                        <button type="button" uk-close class="f-modal-dismiss"></button>

                    </span>

                </header>

                <main>

                    <form>

                        <div>
                        <!-- Desktop Notification Status Text -->

                        </div>

                        <div class="columns is-flex-desktop-only is-multiline">

                            <div class="f-dropdown column is-9">

                                <h3 class="f-h3">Show desktop notifications for:</h3>

                                <div class="f-dropdownTrigger">All Activity

                                </div>

                                <div class="content">

                                    <a data = 1 href="#" class="dropdown-item">All Activity

                                  </a>

                                    <a data = 2 href="#" class="dropdown-item">Important Activity only

                                  </a>

                                    <a data = 3 href="#" class="dropdown-item">Nothing

                                  </a>

                                </div>

                            </div>

                            <div class="f-dropdown column is-9">

                                <h3 class="f-h3">Send an email with unread messages for:</h3>

                                <div class="f-dropdownTrigger">All Activity

                                </div>

                                <div class="content setting-unread-msg">

                                    <a data = 1 href="#" class="dropdown-item">All Activity

                                  </a>

                                    <a data = 2 href="#" class="dropdown-item">Important Activity only

                                  </a>

                                    <a data = 3 href="#" class="dropdown-item">Nothing

                                  </a>

                                </div>

                                <div class="f-dropdownTrigger">Immediate

                                </div>

                                <div class="content setting-unread-interval">

                                    <a href="#" data = 1 class="dropdown-item">Immediate

                                  </a>                                    

                                    <a data = 2 href="#" class="dropdown-item">Every 15 minutes

                                  </a>

                                    <a data = 3 href="#" class="dropdown-item">Once an hour

                                  </a>

                                    <a data = 4 href="#" class="dropdown-item">Once a Day

                                  </a>

                                    <a data = 4 href="#" class="dropdown-item">Only send when offline

                                  </a>

                                </div>

                            </div>

                            <div class="f-dropdown column is-9">

                                <h3 class="f-h3">In message composer pressing enter key will:</h3>

                                <div class="f-dropdownTrigger">Send Message

                                </div>

                                <div class="content">

                                    <a data = 1 href="#" class="dropdown-item">Send Message

                                  </a>

                                    <a data = 2 href="#" class="dropdown-item">Add a line break

                                  </a>

                                </div>

                            </div>

                        </div>

                    </form>

                </main>

                <footer>

                    <div class="field is-grouped is-pulled-right">

                        <p class="control">

                            <a class="button f-modal-dismiss">Cancel

                        </a>

                        </p>

                        <p class="control">

                            <a class="button is-link" style="background-color: var(--fOrange)">Save changes

                        </a>

                        </p>

                    </div>

                </footer>

            </div>

            <div class="f-modal" id="newGroupModal">

                <header>

                    <h1 style="display: inline-block;">Create a New Group Chat</h1>

                    <span class="is-pulled-right">

                        <button type="button" uk-close class="f-modal-dismiss"></button>

                    </span>

                </header>

                <main>

                    <h3>Group Chat Name</h3>

                    <div class="control">

                        <input class="input" type="text" placeholder="What do you want to call this group?">

                    </div>

                     <blockquote></blockquote>

                    <hr>

                    <h3>FexJob Contact</h3>

                    <div style="width: 90%;margin-left: auto;margin-right: auto;" id="creategroupdata">

                      

                    </div>

                </main>

                <footer>

                    <div class="field is-grouped is-pulled-right">

                        <p class="control">

                            <a class="button f-modal-dismiss">Cancel

                        </a>

                        </p>

                        <p class="control">

                            <a id="is-createGroup" class="button is-link" style="background-color: var(--fOrange)">Create

                        </a>

                        </p>

                    </div>

                </footer>

            </div>

            <div class="f-modal" id="viewImageModal">

               <div id="modalDisplay">

                   <main>

                       <div id="gal">

                            <div class="media-header">

                                <h1 class="uk-text-lead">Media</h1>

                            </div>

                           <div class="media-body">

                              
                           </div>

                           

                       </div>

                       <div id="gallery-display">

                            <img src="" alt="" style="z-index:1">

                            <p style="position:absolute;top:50%;text-align:center;color:#ccc">FexChat</p>

                       </div>

                       <div class="menuBar" style="z-index:2">

                           <div class="bar1 f-modal-dismiss">

                                <span class=" mdi mdi-close"></span>

                           </div>

                            <div class="bar2">

                                <span class="mdi mdi-download"></span>

                            </div>

                            <div class="bar3">

                                <span class="mdi mdi-delete"></span>

                            </div>

                       </div>

                   </main>

               </div>

            </div>

            <div class="f-modal" id="out-of-office-modal">

                <header>

                    <h1 style="display: inline-block;">Out Of Office</h1>

                    <span class="is-pulled-right">

                        <button type="button" uk-close class="f-modal-dismiss"></button>

                    </span>

                </header>

                <main>

                    <p>Out of Office is an auto-reply message to any new message you will receive once you're offline. </p>

                    <br>

                    <div class="control">

                        <input class="input" type="text" placeholder="Your message" 

                        oninput="this.parentElement.nextElementSibling.innerText = this.value">

                   </div>

                    <blockQuote></blockQuote>

                </main>

                <footer>

                    <div class="field is-grouped is-pulled-right">

                        <p class="control">

                            <a class="button f-modal-dismiss">Cancel

                        </a>

                        </p>

                        <p class="control">

                            <a class="button is-link" style="background-color: var(--fOrange)">Create

                        </a>

                        </p>

                    </div>

                </footer>

            </div>

            <div class="f-modal" id="group-info-modal">

                <div>

                    <span style="position: absolute;right: 1em;top: .5em;">

                        <button type="button" uk-close class="f-modal-dismiss"></button>

                    </span>

                    <div>

                        <div style="background-image:url(http://fexjob.com/uploads/profile/groupDefaultImage.png)"></div>

                    </div>

                    <div>

                        <div class="edit">

                            <input class="input" type="text" placeholder="Edit Group Name" value="FexChat Group" readonly>

                            <span id="edit-edit" uk-icon="icon: pencil" style="padding-top: .8em;" title="Edit" uk-tooltip></span>

                            <span id="edit-save" uk-icon="icon: check" style="padding-top: .8em;" title="Save" uk-tooltip></span>

                            <span id="edit-cancel" uk-icon="icon: close" style="padding-top: .8em;margin-left: .5rem;" title="Cancel" uk-tooltip></span>

                        </div>

                    </div>

                    <div style="padding: .5rem 0;">

                        <p ><i class="mdi mdi-accounts-outline" style="font-size: 1.35em;vertical-align: text-bottom;"> </i> 5 Participants</p>

                    </div>

                    <div>

                        <dl>

                            <dt>Administrators:</dt>

                            <dd style="padding-left: 1.5rem"><!--Admin Name --></dd>

                        </dl>

                    </div>

                    <div>

                        <div>

                            <p>

                                <i class="mdi mdi-notifications-none" style="font-size: 1.35em;vertical-align: text-bottom;"></i> Notifications:

                            </p>

                            <p>

                                <span class="switch"><span></span></span><span>&nbsp;Off</span>

                            </p>

                        </div>

                    </div>

                    <div>

                        <div><p><i uk-icon="icon: sign-out"></i> <a href="javascript:void(0)">Exit Group</a></p></div>

                    </div>

                </div>

            </div>

            <div class="f-modal" id="user-info-modal">

                <div>

                    <span style="position: absolute;right: 1em;top: .5em;">

                        <button type="button" uk-close class="f-modal-dismiss"></button>

                    </span>

                    <div>

                        <div style="background-image:url(assets/images/avater3.jpg)"></div>

                        <div class="uk-align-center uk-position-center"><span uk-spinner="ratio: .8"></span></div>

                    </div>

                    <div>

                        <p> <span><!-- User Profile Name --></span> 

                            <br>

                            <small><!-- User Location --></small>

                        </p>

                    </div>

                    

                    <div>

                        <p>

<!-- User Skills -->

                        </p>

                    </div>

                    <div>

                        <p>

                            Description

                            <br>

                            <small>

<!-- User Profile Description -->

                            </small>

                        </p>

                    </div>

                    <div>

                        <div>

                            <p>

                                <i class="mdi mdi-notifications-none" style="font-size: 1.35em;vertical-align: text-bottom;"></i> Notifications:

                            </p>

                            <p>

                                <span class="switch">

                                    <span></span>

                                </span>

                                <span>&nbsp;Off</span>

                            </p>

                        </div>

                    </div>

                    <div>

                        <div>

                            <p>

                                <i uk-icon="icon: sign-out"></i>

                                <a href="javascript:void(0)">Remove Contact</a>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <!-- End -->



        </div>

        <!--   App End -->

        <script>var base_url = '<?= base_url() ?>' , userId = <?= $id ?>,userKey = `<?= $chat_token ?>`,userRole = `<?php if($role_id == 4){echo "freelancer";}elseif($role_id == 5){echo "customer";} ?>`,job = <?= $job_id ?>,room = <?= $room_id ?>,roomKey = '<?= $room_key ?>';</script>

        <script src="<?= base_url() ?>assets/fexchat/assets/js/jquery.min.js"></script>

        <script src="<?= base_url() ?>assets/fexchat/assets/js/uiKit.min.js"></script>

        <script src="<?= base_url() ?>assets/fexchat/assets/js/uiKit-icons.min.js"></script>

        <script src="/assets/fexchat/emojis/activities.json"></script>

        <script src="/assets/fexchat/emojis/animal_and_nature.json"></script>

        <script src="/assets/fexchat/emojis/flags.json"></script>

        <script src="/assets/fexchat/emojis/food_and_drink.json"></script>

        <script src="/assets/fexchat/emojis/objects.json"></script>

        <script src="/assets/fexchat/emojis/smiley_and_people.json"></script>

        <script src="/assets/fexchat/emojis/symbols.json"></script>

        <script src="/assets/fexchat/emojis/travel_and_places.json"></script>

        <script src="<?= base_url() ?>assets/fexchat/src/components/functions.js"></script>

        <script src="<?= base_url() ?>assets/fexchat/src/emoji.js"></script>

        <script src="<?= base_url() ?>assets/fexchat/src/main.js"></script>
        <script src="<?= base_url() ?>assets/fexchat/assets/js/moment.js"></script>
        <script src="<?= base_url() ?>assets/fexchat/assets/js/moment.timeZone.js"></script>
        <script src="<?= base_url() ?>assets/fexchat/chat/function.js"></script>
        <script src="<?= base_url() ?>assets/fexchat/chat/forall.js"></script>
        <script src="<?= base_url() ?>assets/fexchat/chat/client.js"></script>
        <script src="<?= base_url() ?>assets/fexchat/chat/uploader.js"></script>
         <script>
            $('.links>a').click(function (e) {
                e.preventDefault()
                e.stopPropagation()
                    $('[dropdown]').toggleClass('active')
            })
            $(document).on('click', function (event) {
                if (!$(event.target).closest('.link').length) {
                    $('[dropdown]').removeClass('active');
                }
            });
        </script>

    </body>

</html>


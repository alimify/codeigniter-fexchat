<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8"> 
    <title>FexChat</title>
    <?php if($room_id && $room_key){ ?>
    <script src="http://50.31.134.79:9000/socket.io/socket.io.js"></script> <?php } 
    ?>
    
    <link rel="stylesheet" href="/assets/fexchat/assets/css/uikit.min.css">
    <link rel="stylesheet" href="/assets/fexchat/assets/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" href="/assets/fexchat/node_modules/bulma/css/bulma.css">
    <link rel="stylesheet" href="/assets/fexchat/assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="/assets/fexchat/assets/css/app.css">
    <link rel="stylesheet" href="/dist/css/app.min.css">
</head>

<body>
    <!-- App Root -->
    <div class="root" id="root">
        <div class="fex-app" id="parent" draggable="true">
            <!-- Main Start -->
            <div class="f-main">

                <!-- Chat Display Header -->
                <header class="f-main-header single-chat">
                    <h3>MESSAGE</h3>
                </header>
                <!-- Chat Display Header End -->
<?php if(!$room_id && !$room_key){
    echo "<main class='f-main-body' id='mRoot'>No Message History Available..</main><!--<footer id='eRoot'>Hire or ask for interview him..</footer>--></div></div></div></body>";
    exit();
} ?>
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
                            <div class=" active" title="Smilies and People">
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

<div id="modalDisplay" style="display: none;">
    <main>
        <div id="gallery-display"><img src=""></div>
    </main>
</div>

            </div>
        </div>

    </div>
    <!--   App End -->
 <script>var base_url = '<?= base_url() ?>' , userId = <?= $id ?>,userKey = `<?= $chat_token ?>`,userRole = `<?php if($role_id == 4){echo "freelancer";}elseif($role_id == 5){echo "customer";} ?>`,job = <?= $job_id ?>,room = <?= $room_id ?>,roomKey = '<?= $room_key ?>';</script>
    <script src="/assets/fexchat/assets/js/jquery.min.js"></script>
    <script src="/assets/fexchat/assets/js/uiKit.min.js"></script>
    <script src="/assets/fexchat/assets/js/uiKit-icons.min.js"></script>
    <script src="/assets/fexchat/emojis/activities.json"></script>
    <script src="/assets/fexchat/emojis/animal_and_nature.json"></script>
    <script src="/assets/fexchat/emojis/flags.json"></script>
    <script src="/assets/fexchat/emojis/food_and_drink.json"></script>
    <script src="/assets/fexchat/emojis/objects.json"></script>
    <script src="/assets/fexchat/emojis/smiley_and_people.json"></script>
    <script src="/assets/fexchat/emojis/symbols.json"></script>
    <script src="/assets/fexchat/emojis/travel_and_places.json"></script>
    <script src="/assets/fexchat/src/components/functions.js"></script>
    <script src="/assets/fexchat/src/emoji.js"></script>
    <script src="/assets/fexchat/src/main.js"></script>
    <!--<script src="/assets/fexchat/src/professional.js"></script>-->
    <script src="<?= base_url() ?>assets/fexchat/assets/js/moment.js"></script>
    <script src="<?= base_url() ?>assets/fexchat/assets/js/moment.timeZone.js"></script>
    <script src="<?= base_url() ?>assets/fexchat/chat/function.js"></script>
    <script src="<?= base_url() ?>assets/fexchat/chat/forall.js"></script>
    <script src="<?= base_url() ?>assets/fexchat/chat/profileChat.js"></script>
    <script src="<?= base_url() ?>assets/fexchat/chat/uploader.js"></script>
</body>
</html>
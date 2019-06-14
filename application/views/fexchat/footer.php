<!--   App End -->
<div id="this-is-for-default-selector"></div>
        <script>var base_url = '<?= base_url() ?>' , userId = <?= $id ?>,userKey = `<?= $chat_token ?>`,userRole = `<?php if($role_id == 4){echo "freelancer";}elseif($role_id == 5){echo "customer";} ?>`,job = <?= $job_id ?>,room = <?= $room_id ?>,roomKey = '<?= $room_key ?>';</script>
        <script src="<?= base_url() ?>assets/fexchat/chat/server.js"></script>
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


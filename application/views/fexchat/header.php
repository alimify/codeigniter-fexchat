<!DOCTYPE html>

<html>

    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <!--<meta name="viewport" content="width=device-width, initial-scale=1">-->
        <title>FexChat</title>

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/uikit.min.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/material-design-iconic-font.min.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/bulma.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/font-awesome.min.css">

        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/app.css">
        <link rel="stylesheet" href="<?= base_url() ?>assets/fexchat/assets/css/nav.min.css">

    </head>

    <body>
        <nav class="f-navbar">
            <div class="container">
                <a href="<?= base_url() ?>" class="logo"><img src="<?= base_url() ?>assets/images/logo-w.png" alt=""></a>
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
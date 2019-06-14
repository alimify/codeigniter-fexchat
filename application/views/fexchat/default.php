
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
                    <div class="no-contact">
                        No room or contact were found
                    </div>
					<!-- Menu Search & New Group End //-->

					<!-- Menu Contacts Listing End //-->



					<!-- Menu Sidebar Setting Start -->

					<div class="f-menu-siderbar">

						<nav class="is-center">

							<span class="is-uppercase">Professional's name</span>

							<a class="uk-icon-link" uk-icon="ratio: 1.5;icon: arrow-left" id="f-menu-siderbar-close" style="color: #fff"></a>

						</nav>


					</div>

					<!-- Menu Sidebar Setting End -->

					<section id="searchDisplay">

						<div>
                            <span uk-spinner="ratio: .8"></span> Search...
                        </div>

						
					</section>

					<!-- Search Display -->
                    
					<!-- Search Display End// -->

				</main>

				<!--  Menu Body End //-->

			</div>

			<!-- Menu End //-->
			<!-- Main Start -->

			<div class="f-main is-empty"   style="background-image: url(../assets/images/chat/banner.png)">

                <h1>No Message Yet</h1>
                <p>Once you connect with a <?php if($role_id == 4) echo "customer"; elseif($role_id == 5) echo "professional"; ?>, your messages will be displayed here.</p>
                <p>To get started, <?php if($role_id == 4) echo '<a href="http://fexjob.com/professional/search-job" style="color:#ff6a00">search for jobs</a>  and submit job proposals. '; elseif ($role_id == 5) {
                     echo '<a href="http://fexjob.com/customer/start-job-posting" style="color:#ff6a00">Post a job</a> and start hiring expert..';
                } ?></p>

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

						Desktop alerts are not enabled on this browser.
						<a href="">Click Here</a>

						to enable desktop alerts.



					</div>

					<div class="columns is-flex-desktop-only is-multiline">

						<div class="f-dropdown column is-9">

							<h3 class="f-h3">Show desktop notifications for:</h3>

							<div class="f-dropdownTrigger">All Activity

							</div>

							<div class="content">

								<a href="#" class="dropdown-item active">All Activity

								</a>

								<a href="#" class="dropdown-item">Important Activity only

								</a>

								<a href="#" class="dropdown-item">Nothing

								</a>

							</div>

						</div>

						<div class="f-dropdown column is-9">

							<h3 class="f-h3">Send an email with unread messages for:</h3>

							<div class="f-dropdownTrigger">All Activity

							</div>

							<div class="content">

								<a href="#" class="dropdown-item active">All Activity

								</a>

								<a href="#" class="dropdown-item">Important Activity only

								</a>

								<a href="#" class="dropdown-item">Nothing

								</a>

							</div>

							<div class="f-dropdownTrigger">Immediate

							</div>

							<div class="content">

								<a href="#" class="dropdown-item active">Every 15 minutes

								</a>

								<a href="#" class="dropdown-item">Once an hour

								</a>

								<a href="#" class="dropdown-item">Once a Day

								</a>

								<a href="#" class="dropdown-item">Only send when offline

								</a>

							</div>

						</div>

						<div class="f-dropdown column is-9">

							<h3 class="f-h3">In message composer pressing enter key will:</h3>

							<div class="f-dropdownTrigger">Send Message

							</div>

							<div class="content">

								<a href="#" class="dropdown-item active">Send Message

								</a>

								<a href="#" class="dropdown-item">Add a line break

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

					<input class="input" type="text" placeholder="Your message" oninput="this.parentElement.nextElementSibling.innerText = this.value">

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

		<!-- End -->



	</div>
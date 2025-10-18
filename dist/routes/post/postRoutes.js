"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const postController_1 = require("../../controllers/post/postController");
const uploadController_1 = require("../../controllers/users/uploadController");
const commentController_1 = require("../../controllers/post/commentController");
const momentController_1 = require("../../controllers/post/momentController");
const router = express_1.default.Router();
router.route('/follow/:id').patch(upload.any(), postController_1.followUser);
router.route('/poll/:id').post(upload.any(), postController_1.updatePoll);
router.route('/followers').get(postController_1.getFollowers);
router.route('/uploads').get(uploadController_1.getUploads).post(upload.any(), uploadController_1.createUpload);
router.route('/stats').get(postController_1.getPostStat).patch(upload.any(), postController_1.updatePostStat);
router.route('/like').get(postController_1.getPostStat).patch(upload.any(), postController_1.toggleLikePost);
router.route('/hate').get(postController_1.getPostStat).patch(upload.any(), postController_1.toggleHatePost);
router.route('/repost/:id').post(upload.any(), postController_1.repostPost);
router.route('/pin/:id').post(upload.any(), postController_1.pinPost);
router.route('/block/:id').post(upload.any(), postController_1.blockUser);
router.route('/blocks').get(postController_1.getBlockedUsers);
router.route('/mutes').get(postController_1.getMutedUsers);
router.route('/mute/:id').patch(upload.any(), postController_1.muteUser);
router.route('/view').patch(postController_1.updatePostViews);
router.route('/user').get(postController_1.getUserPosts);
router.route('/').get(postController_1.getPosts).post(upload.any(), postController_1.createPost);
router.route('/following').get(postController_1.getFollowings);
router.route('/bookmarks').get(postController_1.getBookMarkedPosts);
router.route('/search').get(postController_1.searchPosts);
// router.route('/check-nsfw').post(uploadFile.single('file'), checkNudeMedia)
router.route('/comments').get(commentController_1.getComments).post(upload.any(), commentController_1.createComment);
router.route('/moments').get(momentController_1.getMoments);
router.route('/moments/:id').delete(momentController_1.deleteMoment);
router
    .route('/uploads/:id')
    .get(uploadController_1.getUploadById)
    .patch(upload.any(), uploadController_1.updateUpload)
    .delete(uploadController_1.deleteUpload);
router
    .route('/:id')
    .get(postController_1.getPostById)
    .patch(upload.any(), postController_1.updatePost)
    .delete(postController_1.deletePost);
exports.default = router;

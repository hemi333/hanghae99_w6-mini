const express = require("express");
const router = express.Router();

const { Comment } = require("../models");
const { Post } = require("../models");

const authMiddleware = require("../middlewares/auth-middleware");

//api 시작
//댓글 작성 api with post('/api/comments/_postId')
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params; //_postId를 사용하겠다고 변수선언
    //request body 에 적힌 변수들을 기록해둡니다.
    const { comment } = req.body;

    //body에 입력 받은 수정할 댓들이 없으면 수정할수 없습니다.
    if (!comment) {
      return res.json({ message: "댓글 내용을 입력해 주세요." });
    }
    //_postId와 일치하는 데이터를 DB에서 모두 찾습니다.
    const posts = await Post.findAll({ where: { postId } });

    if (!posts) {
      return res.json({ message: "해당 게시글이 없습니다." });
    }
    //미들웨어를 거쳐 인증된 사용자 객체 user: 사용자 정보를 모두 담고 있음
    const { user } = await res.locals;
    //이 comment는 _postId "게시글" 에남겨지는 '댓글'입니다.
    await Comment.create({
      postId,
      userId: user.userId,
      nickname: user.nickname,
      comment,
    });
    res.json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//댓글 목록 조회 with GET("/api/comments/_postId")
router.get("/:postId", async (req, res) => {

    console.log(message);
    res.status(400).json({ message });
  }
});
//댓글 수정 api with put ('api/comments/_commentId')
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;


    console.log(message);
    res.status(400).json({ message });
  }
});
//댓글 삭제 API with delete ("/api/comment")
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comments = await Comment.findOne({ where: { commentId } });
    //찾은게 없으면 삭제할수 없음.
    if (!comments) {
      return res.json({ message: "해당 댓글이 없습니다." });
    }
    //미들웨어로 사용자 인증
    const { user } = await res.locals;

    if (user.nickname != comments.nickname) {
      res.json({ message: "삭제 권한이 없습니다." });
    } else {
      await Comment.destroy({ where: { commentId } });
      return res.json({ message: "댓글을 삭제하였습니다." });
    }
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
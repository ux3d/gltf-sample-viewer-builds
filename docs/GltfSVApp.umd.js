(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.SampleViewerApp = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */

  function create() {
    var out = new ARRAY_TYPE(9);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }

    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Copies the upper-left 3x3 values into the given mat3.
   *
   * @param {mat3} out the receiving 3x3 matrix
   * @param {ReadonlyMat4} a   the source 4x4 matrix
   * @returns {mat3} out
   */

  function fromMat4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
  }
  /**
   * Multiplies two mat3's
   *
   * @param {mat3} out the receiving matrix
   * @param {ReadonlyMat3} a the first operand
   * @param {ReadonlyMat3} b the second operand
   * @returns {mat3} out
   */

  function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b00 = b[0],
        b01 = b[1],
        b02 = b[2];
    var b10 = b[3],
        b11 = b[4],
        b12 = b[5];
    var b20 = b[6],
        b21 = b[7],
        b22 = b[8];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create$1() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a new mat4 initialized with values from an existing matrix
   *
   * @param {ReadonlyMat4} a matrix to clone
   * @returns {mat4} a new 4x4 matrix
   */

  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Transpose the values of a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */

  function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      var a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a12 = a[6],
          a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }

    return out;
  }
  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the source matrix
   * @returns {mat4} out
   */

  function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Calculates the determinant of a mat4
   *
   * @param {ReadonlyMat4} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant(a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  /**
   * Multiplies two mat4s
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the first operand
   * @param {ReadonlyMat4} b the second operand
   * @returns {mat4} out
   */

  function multiply$1(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]; // Cache only the current line of the second matrix

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} out the receiving matrix
   * @param {ReadonlyMat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad); // Perform axis-specific matrix multiplication

    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad); // Perform axis-specific matrix multiplication

    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Returns the translation vector component of a transformation
   *  matrix. If a matrix is built with fromRotationTranslation,
   *  the returned vector will be the same as the translation vector
   *  originally supplied.
   * @param  {vec3} out Vector to receive translation component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */

  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  /**
   * Returns the scaling factor component of a transformation
   *  matrix. If a matrix is built with fromRotationTranslationScale
   *  with a normalized Quaternion paramter, the returned vector will be
   *  the same as the scaling vector
   *  originally supplied.
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */

  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  /**
   * Returns a quaternion representing the rotational component
   *  of a transformation matrix. If a matrix is built with
   *  fromRotationTranslation, the returned quaternion will be the
   *  same as the quaternion originally supplied.
   * @param {quat} out Quaternion to receive the rotation component
   * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {quat} out
   */

  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }

    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat4} q Rotation quaternion
   * @param {ReadonlyVec3} v Translation vector
   * @param {ReadonlyVec3} s Scaling vector
   * @returns {mat4} out
   */

  function fromRotationTranslationScale(out, q, v, s) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */

  function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {ReadonlyVec3} eye Position of the viewer
   * @param {ReadonlyVec3} center Point the viewer is looking at
   * @param {ReadonlyVec3} up vec3 pointing up
   * @returns {mat4} out
   */

  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  /**
   * Alias for {@link mat4.multiply}
   * @function
   */

  var mul = multiply$1;

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$2() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   *
   * @param {ReadonlyVec3} a vector to clone
   * @returns {vec3} a new 3D vector
   */

  function clone$1(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  /**
   * Calculates the length of a vec3
   *
   * @param {ReadonlyVec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */

  function fromValues(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Adds two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */

  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec3's
   *
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {Number} distance between a and b
   */

  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.hypot(x, y, z);
  }
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a vector to normalize
   * @returns {vec3} out
   */

  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to transform
   * @param {ReadonlyMat4} m matrix to transform with
   * @returns {vec3} out
   */

  function transformMat4(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  /**
   * Transforms the vec3 with a quat
   * Can also be used for dual quaternions. (Multiply it with the real part)
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to transform
   * @param {ReadonlyQuat} q quaternion to transform with
   * @returns {vec3} out
   */

  function transformQuat(out, a, q) {
    // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3];
    var x = a[0],
        y = a[1],
        z = a[2]; // var qvec = [qx, qy, qz];
    // var uv = vec3.cross([], qvec, a);

    var uvx = qy * z - qz * y,
        uvy = qz * x - qx * z,
        uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

    var uuvx = qy * uvz - qz * uvy,
        uuvy = qz * uvx - qx * uvz,
        uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2; // vec3.scale(uuv, uuv, 2);

    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  /**
   * Alias for {@link vec3.subtract}
   * @function
   */

  var sub = subtract;
  /**
   * Alias for {@link vec3.length}
   * @function
   */

  var len = length;
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach = function () {
    var vec = create$2();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  }();

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */

  function create$3() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec4 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} a new 4D vector
   */

  function fromValues$1(x, y, z, w) {
    var out = new ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  /**
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {ReadonlyVec4} a vector to normalize
   * @returns {vec4} out
   */

  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }

    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$1 = function () {
    var vec = create$3();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 4;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }

      return a;
    };
  }();

  /**
   * Quaternion
   * @module quat
   */

  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */

  function create$4() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    out[3] = 1;
    return out;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyVec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {quat} out
   **/

  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a the first operand
   * @param {ReadonlyQuat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    var omega, cosom, sinom, scale0, scale1; // calc cosine

    cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    } // calculate coefficients


    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    } // calculate final values


    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyMat3} m rotation matrix
   * @returns {quat} out
   * @function
   */

  function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w

      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)

      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      // |w| <= 1/2
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }

    return out;
  }
  /**
   * Creates a new quat initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {quat} a new quaternion
   * @function
   */

  var fromValues$2 = fromValues$1;
  /**
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */

  var normalize$2 = normalize$1;
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {ReadonlyVec3} a the initial vector
   * @param {ReadonlyVec3} b the destination vector
   * @returns {quat} out
   */

  var rotationTo = function () {
    var tmpvec3 = create$2();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function (out, a, b) {
      var dot$1 = dot(a, b);

      if (dot$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$1;
        return normalize$2(out, out);
      }
    };
  }();
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a the first operand
   * @param {ReadonlyQuat} b the second operand
   * @param {ReadonlyQuat} c the third operand
   * @param {ReadonlyQuat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  var sqlerp = function () {
    var temp1 = create$4();
    var temp2 = create$4();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {ReadonlyVec3} view  the vector representing the viewing direction
   * @param {ReadonlyVec3} right the vector representing the local "right" direction
   * @param {ReadonlyVec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */

  var setAxes = function () {
    var matr = create();
    return function (out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize$2(out, fromMat3(out, matr));
    };
  }();

  function jsToGl(array)
  {
      let tensor = new ARRAY_TYPE(array.length);

      for (let i = 0; i < array.length; ++i)
      {
          tensor[i] = array[i];
      }

      return tensor;
  }

  function jsToGlSlice(array, offset, stride)
  {
      let tensor = new ARRAY_TYPE(stride);

      for (let i = 0; i < stride; ++i)
      {
          tensor[i] = array[offset + i];
      }

      return tensor;
  }

  function initGlForMembers(gltfObj, gltf, webGlContext)
  {
      for (const name of Object.keys(gltfObj))
      {
          const member = gltfObj[name];

          if (member === undefined)
          {
              continue;
          }
          if (member.initGl !== undefined)
          {
              member.initGl(gltf, webGlContext);
          }
          if (Array.isArray(member))
          {
              for (const element of member)
              {
                  if (element !== null && element !== undefined && element.initGl !== undefined)
                  {
                      element.initGl(gltf, webGlContext);
                  }
              }
          }
      }
  }

  function objectsFromJsons(jsonObjects, GltfType)
  {
      if (jsonObjects === undefined)
      {
          return [];
      }

      const objects = [];
      for (const jsonObject of jsonObjects)
      {
          objects.push(objectFromJson(jsonObject, GltfType));
      }
      return objects;
  }

  function objectFromJson(jsonObject, GltfType)
  {
      const object = new GltfType();
      object.fromJson(jsonObject);
      return object;
  }

  function fromKeys(target, jsonObj, ignore = [])
  {
      for(let k of Object.keys(target))
      {
          if (ignore && ignore.find(function(elem){return elem == k;}) !== undefined)
          {
              continue; // skip
          }
          if (jsonObj[k] !== undefined)
          {
              let normalizedK = k.replace("^@", "");
              target[normalizedK] = jsonObj[k];
          }
      }
  }

  function stringHash(str, seed = 0)
  {
      for(var i = 0; i < str.length; ++i)
      {
          seed = Math.imul(31, seed) + str.charCodeAt(i) | 0;
      }

      return seed;
  }

  function combineHashes(hash1, hash2)
  {
      return hash1 ^ (hash1 + 0x9e3779b9 + (hash2 << 6) + (hash2 >> 2));
  }

  function clamp(number, min, max)
  {
      return Math.min(Math.max(number, min), max);
  }

  function getIsGlb(filename)
  {
      return getExtension(filename) == "glb";
  }

  function getExtension(filename)
  {
      const split = filename.toLowerCase().split(".");
      if (split.length == 1)
      {
          return undefined;
      }
      return split[split.length - 1];
  }

  function getContainingFolder(filePath)
  {
      return filePath.substring(0, filePath.lastIndexOf("/") + 1);
  }

  // marker interface used to for parsing the uniforms
  class UniformStruct { }

  class AnimationTimer
  {
      constructor()
      {
          this.startTime = 0;
          this.paused = true;
          this.fixedTime = null;
          this.pausedTime = 0;
      }

      elapsedSec()
      {
          if(this.paused)
          {
              return this.pausedTime / 1000;
          }
          else
          {
              return this.fixedTime || (new Date().getTime() - this.startTime) / 1000;
          }
      }

      toggle()
      {
          if(this.paused)
          {
              this.unpause();
          }
          else
          {
              this.pause();
          }
      }

      start()
      {
          this.startTime = new Date().getTime();
          this.paused = false;
      }

      pause()
      {
          this.pausedTime = new Date().getTime() - this.startTime;
          this.paused = true;
      }

      unpause()
      {
          this.startTime += new Date().getTime() - this.startTime - this.pausedTime;
          this.paused = false;
      }

      reset()
      {
          if(!this.paused) {
              // Animation is running.
              this.startTime = new Date().getTime();
          }
          else {
              this.startTime = 0;
          }
          this.pausedTime = 0;
      }

      setFixedTime(timeInSec)
      {
          this.paused = false;
          this.fixedTime = timeInSec;
      }
  }

  // base class for all gltf objects
  class GltfObject
  {
      constructor()
      {
          this.extensions = undefined;
          this.extras = undefined;
      }

      fromJson(json)
      {
          fromKeys(this, json);
      }

      initGl(gltf, webGlContext)
      {
          initGlForMembers(this, gltf, webGlContext);
      }
  }

  class gltfCamera extends GltfObject
  {
      constructor(
          type = "perspective",
          znear = 0.01,
          zfar = Infinity,
          yfov = 45.0 * Math.PI / 180.0,
          aspectRatio = undefined,
          xmag = 1.0,
          ymag = 1.0,
          name = undefined,
          nodeIndex = undefined)
      {
          super();
          this.type = type;
          this.znear = znear;
          this.zfar = zfar;
          this.yfov = yfov; // radians
          this.xmag = xmag;
          this.ymag = ymag;
          this.aspectRatio = aspectRatio;
          this.name = name;
          this.node = nodeIndex;
      }

      initGl(gltf, webGlContext)
      {
          super.initGl(gltf, webGlContext);

          let cameraIndex = undefined;
          for (let i = 0; i < gltf.nodes.length; i++)
          {
              cameraIndex = gltf.nodes[i].camera;
              if (cameraIndex === undefined)
              {
                  continue;
              }

              if (gltf.cameras[cameraIndex] === this)
              {
                  this.node = i;
                  break;
              }
          }

          // cameraIndex stays undefined if camera is not assigned to any node
          if(this.node === undefined && cameraIndex !== undefined)
          {
              console.error("Invalid node for camera " + cameraIndex);
          }
      }

      fromJson(jsonCamera)
      {
          this.name = name;
          if(jsonCamera.perspective !== undefined)
          {
              this.type = "perspective";
              fromKeys(this, jsonCamera.perspective);
          }
          else if(jsonCamera.orthographic !== undefined)
          {
              this.type = "orthographic";
              fromKeys(this, jsonCamera.orthographic);
          }
      }

      sortPrimitivesByDepth(gltf, drawables)
      {
          // Precompute the distances to avoid their computation during sorting.
          for (const drawable of drawables)
          {
              const modelView = create$1();
              multiply$1(modelView, this.getViewMatrix(gltf), drawable.node.worldTransform);

              // Transform primitive centroid to find the primitive's depth.
              const pos = transformMat4(create$2(), clone$1(drawable.primitive.centroid), modelView);

              drawable.depth = pos[2];
          }

          // 1. Remove primitives that are behind the camera.
          //    --> They will never be visible and it is cheap to discard them here.
          // 2. Sort primitives so that the furthest nodes are rendered first.
          //    This is required for correct transparency rendering.
          return drawables
              .filter((a) => a.depth <= 0)
              .sort((a, b) => a.depth - b.depth);
      }

      getProjectionMatrix()
      {
          const projection = create$1();

          if (this.type === "perspective")
          {
              perspective(projection, this.yfov, this.aspectRatio, this.znear, this.zfar);
          }
          else if (this.type === "orthographic")
          {
              projection[0]  = 1.0 / this.xmag;
              projection[5]  = 1.0 / this.ymag;
              projection[10] = 2.0 / (this.znear - this.zfar);
              projection[14] = (this.zfar + this.znear) / (this.znear - this.zfar);
          }

          return projection;
      }

      getViewMatrix(gltf)
      {
          const view = create$1();
          const position = this.getPosition(gltf);
          const target = this.getTarget(gltf);
          lookAt(view, position, target, fromValues(0, 1, 0));
          return view;
      }

      getTarget(gltf)
      {
          const target = create$2();
          const position = this.getPosition(gltf);
          const lookDirection = this.getLookDirection(gltf);
          add(target, lookDirection, position);
          return target;
      }

      getPosition(gltf)
      {
          const position = create$2();
          const node = this.getNode(gltf);
          getTranslation(position, node.worldTransform);
          return position;
      }

      getLookDirection(gltf)
      {
          const direction = create$2();
          const rotation = this.getRotation(gltf);
          transformQuat(direction, fromValues(0, 0, -1), rotation);
          return direction;
      }

      getRotation(gltf)
      {
          const rotation = create$4();
          const node = this.getNode(gltf);
          getRotation(rotation, node.worldTransform);
          return rotation;
      }

      clone()
      {
          return new gltfCamera(
              this.type,
              this.znear,
              this.zfar,
              this.yfov,
              this.aspectRatio,
              this.xmag,
              this.ymag,
              this.name,
              this.node);
      }

      getNode(gltf)
      {
          return gltf.nodes[this.node];
      }

      getTransformMatrix(gltf)
      {
          const node = this.getNode(gltf);
          if (node !== undefined && node.worldTransform !== undefined)
          {
              return node.worldTransform;
          }
          return create$1();

      }

      // Returns a JSON object describing the user camera's current values.
      getDescription(gltf)
      {
          const asset = {
              "generator": "gltf-sample-viewer",
              "version": "2.0"
          };

          const camera = {
              "type": this.type
          };

          if (this.name !== undefined)
          {
              camera["name"] = this.name;
          }

          if (this.type === "perspective")
          {
              camera["perspective"] = {};
              if (this.aspectRatio !== undefined)
              {
                  camera["perspective"]["aspectRatio"] = this.aspectRatio;
              }
              camera["perspective"]["yfov"] = this.yfov;
              if (this.zfar != Infinity)
              {
                  camera["perspective"]["zfar"] = this.zfar;
              }
              camera["perspective"]["znear"] = this.znear;
          }
          else if (this.type === "orthographic")
          {
              camera["orthographic"] = {};
              camera["orthographic"]["xmag"] = this.xmag;
              camera["orthographic"]["ymag"] = this.ymag;
              camera["orthographic"]["zfar"] = this.zfar;
              camera["orthographic"]["znear"] = this.znear;
          }

          const mat = this.getTransformMatrix(gltf);

          const node = {
              "camera": 0,
              "matrix": [mat[0], mat[1], mat[2], mat[3],
                         mat[4], mat[5], mat[6], mat[7],
                         mat[8], mat[9], mat[10], mat[11],
                         mat[12], mat[13], mat[14], mat[15]]
          };

          if (this.nodeIndex !== undefined && gltf.nodes[this.nodeIndex].name !== undefined)
          {
              node["name"] = gltf.nodes[this.nodeIndex].name;
          }

          return {
              "asset": asset,
              "cameras": [camera],
              "nodes": [node]
          };
      }
  }

  function getSceneExtents(gltf, sceneIndex, outMin, outMax)
  {
      for (const i of [0, 1, 2])
      {
          outMin[i] = Number.POSITIVE_INFINITY;
          outMax[i] = Number.NEGATIVE_INFINITY;
      }

      const scene = gltf.scenes[sceneIndex];

      let nodeIndices = scene.nodes.slice();
      while(nodeIndices.length > 0)
      {
          const node = gltf.nodes[nodeIndices.pop()];
          nodeIndices = nodeIndices.concat(node.children);

          if (node.mesh === undefined)
          {
              continue;
          }

          const mesh = gltf.meshes[node.mesh];
          if (mesh.primitives === undefined)
          {
              continue;
          }

          for (const primitive of mesh.primitives)
          {
              const attribute = primitive.glAttributes.find(a => a.attribute == "POSITION");
              if (attribute === undefined)
              {
                  continue;
              }

              const accessor = gltf.accessors[attribute.accessor];
              const assetMin = create$2();
              const assetMax = create$2();
              getExtentsFromAccessor(accessor, node.worldTransform, assetMin, assetMax);

              for (const i of [0, 1, 2])
              {
                  outMin[i] = Math.min(outMin[i], assetMin[i]);
                  outMax[i] = Math.max(outMax[i], assetMax[i]);
              }
          }
      }
  }

  function getExtentsFromAccessor(accessor, worldTransform, outMin, outMax)
  {
      const boxMin = create$2();
      transformMat4(boxMin, jsToGl(accessor.min), worldTransform);

      const boxMax = create$2();
      transformMat4(boxMax, jsToGl(accessor.max), worldTransform);

      const center = create$2();
      add(center, boxMax, boxMin);
      scale(center, center, 0.5);

      const centerToSurface = create$2();
      sub(centerToSurface, boxMax, center);

      const radius = length(centerToSurface);

      for (const i of [0, 1, 2])
      {
          outMin[i] = center[i] - radius;
          outMax[i] = center[i] + radius;
      }
  }

  const PanSpeedDenominator = 3500;
  const MaxNearFarRatio = 10000;

  class UserCamera extends gltfCamera
  {
      /**
       * Create a new user camera.
       */
      constructor()
      {
          super();

          this.transform = create$1();
          this.rotAroundY = 0;
          this.rotAroundX = 0;
          this.distance = 1;
          this.baseDistance = 1.0;
          this.zoomExponent = 5.0;
          this.zoomFactor = 0.01;
          this.orbitSpeed = 1 / 180;
          this.panSpeed = 1;
          this.sceneExtents = {
              min: create$2(),
              max: create$2()
          };
      }

      getTransformMatrix()
      {
          return this.transform;
      }

      /**
       * Sets the vertical FoV of the user camera.
       * @param {number} yfov 
       */
      setVerticalFoV(yfov)
      {
          this.yfov = yfov;
      }

      /**
       * Returns the current position of the user camera as a vec3.
       */
      getPosition()
      {
          let pos = create$2();
          getTranslation(pos, this.transform);
          return pos;
      }

      /**
       * Returns the current rotation of the user camera as quat.
       */
      getRotation()
      {
          let rot = create$4();
          getRotation(rot, this.transform);
          return rot;
      }

      /**
       * Returns the normalized direction the user camera looks at as vec3.
       */
      getLookDirection()
      {
          let dir = [-this.transform[8], -this.transform[9], -this.transform[10]];
          normalize(dir, dir);
          return dir;
      }

      /**
       * Returns the current target the camera looks at as vec3.
       * This multiplies the viewing direction with the distance.
       * For distance 0 the normalized viewing direction is used.
       */
      getTarget()
      {
          const target = create$2();
          const position = this.getPosition();
          let lookDirection = this.getLookDirection();
          if (this.distance != 0 && this.distance != 1)
          {
              lookDirection = lookDirection.map(x => x * this.distance);
          }
          add(target, lookDirection, position);
          return target;
      }

      /**
       * Look from user camera to target.
       * This changes the transformation of the user camera.
       * @param {vec3} from 
       * @param {vec3} to 
       */
      lookAt(from, to)
      {
          this.transform = create$1();
          lookAt(this.transform, from, to, fromValues(0, 1, 0));
      }

      /**
       * Sets the position of the user camera.
       * @param {vec3} position 
       */
      setPosition(position)
      {
          this.transform[12] = position[0];
          this.transform[13] = position[1];
          this.transform[14] = position[2];
      }

      /**
       * This rotates the user camera towards the target and sets the position of the user camera
       * according to the current distance.
       * @param {vec3} target 
       */
      setTarget(target)
      {
          let pos = create$2();
          getTranslation(pos, this.transform);
          this.transform = create$1();
          lookAt(this.transform, pos, target, fromValues(0, 1, 0));
          this.setDistanceFromTarget(this.distance, target);
      }

      /**
       * Sets the rotation of the camera.
       * Yaw and pitch in euler angles (degrees).
       * @param {number} yaw 
       * @param {number} pitch 
       */
      setRotation(yaw, pitch)
      {
          const tmpPos = this.getPosition();
          let mat4x = create$1();
          let mat4y = create$1();
          fromXRotation(mat4x, pitch);
          fromYRotation(mat4y, yaw);
          this.transform = mat4y;
          this.setPosition(tmpPos);
          multiply$1(this.transform, this.transform, mat4x);
      }

      /**
       * Transforms the user camera to look at a target from a specfic distance using the current rotation.
       * This will only change the position of the user camera, not the rotation.
       * Use this function to set the distance.
       * @param {number} distance 
       * @param {vec3} target 
       */
      setDistanceFromTarget(distance, target)
      {
          const lookDirection = this.getLookDirection();
          const distVec = lookDirection.map(x => x * -distance);
          let pos = create$2();
          add(pos, target, distVec);
          this.setPosition(pos);
          this.distance = distance;
      }

      /**
       * Zoom exponentially according to this.zoomFactor and this.zoomExponent.
       * The default zoomFactor provides good zoom speed for values from [-1,1].
       * @param {number} value 
       */
      zoomBy(value)
      {
          let target = this.getTarget();

          // zoom exponentially
          let zoomDistance = Math.pow(this.distance / this.baseDistance, 1.0 / this.zoomExponent);
          zoomDistance += this.zoomFactor * value;
          zoomDistance = Math.max(zoomDistance, 0.0001);
          this.distance = Math.pow(zoomDistance, this.zoomExponent) * this.baseDistance;

          this.setDistanceFromTarget(this.distance, target);
          this.fitCameraPlanesToExtents(this.sceneExtents.min, this.sceneExtents.max);
      }

      /**
       * Orbit around the target.
       * x and y should be in radient and are added to the current rotation.
       * The rotation around the x-axis is limited to 180 degree.
       * The axes are inverted: e.g. if y is positive the camera will look further down.
       * @param {number} x 
       * @param {number} y 
       */
      orbit(x, y)
      {
          const target = this.getTarget();
          const rotAroundXMax = Math.PI / 2 - 0.01;
          this.rotAroundY += (-x * this.orbitSpeed);
          this.rotAroundX += (-y * this.orbitSpeed);
          this.rotAroundX = clamp(this.rotAroundX, -rotAroundXMax, rotAroundXMax);
          this.setRotation(this.rotAroundY, this.rotAroundX);
          this.setDistanceFromTarget(this.distance, target);
      }

      /**
       * Pan the user camera.
       * The axes are inverted: e.g. if y is positive the camera will move down.
       * @param {number} x 
       * @param {number} y 
       */
      pan(x, y)
      {
          const right = fromValues(this.transform[0], this.transform[1], this.transform[2]);
          normalize(right, right);
          scale(right, right, -x * this.panSpeed * (this.distance / this.baseDistance));

          const up = fromValues(this.transform[4], this.transform[5], this.transform[6]);
          normalize(up, up);
          scale(up, up, -y * this.panSpeed * (this.distance / this.baseDistance));

          let pos = this.getPosition();

          add(pos, pos, up);
          add(pos, pos, right);

          this.setPosition(pos);
      }

      fitPanSpeedToScene(min, max)
      {
          const longestDistance = distance(min, max);
          this.panSpeed = longestDistance / PanSpeedDenominator;
      }

      reset()
      {
          this.transform = create$1();
          this.rotAroundX = 0;
          this.rotAroundY = 0;
          this.fitDistanceToExtents(this.sceneExtents.min, this.sceneExtents.max);
          this.fitCameraTargetToExtents(this.sceneExtents.min, this.sceneExtents.max);
      }

      /**
       * Calculates a camera position which looks at the center of the scene from an appropriate distance.
       * This calculates near and far plane as well.
       * @param {Gltf} gltf 
       * @param {number} sceneIndex 
       */
      fitViewToScene(gltf, sceneIndex)
      {
          this.transform = create$1();
          this.rotAroundX = 0;
          this.rotAroundY = 0;
          getSceneExtents(gltf, sceneIndex, this.sceneExtents.min, this.sceneExtents.max);
          this.fitDistanceToExtents(this.sceneExtents.min, this.sceneExtents.max);
          this.fitCameraTargetToExtents(this.sceneExtents.min, this.sceneExtents.max);

          this.fitPanSpeedToScene(this.sceneExtents.min, this.sceneExtents.max);
          this.fitCameraPlanesToExtents(this.sceneExtents.min, this.sceneExtents.max);

      }

      fitDistanceToExtents(min, max)
      {
          const maxAxisLength = Math.max(max[0] - min[0], max[1] - min[1]);
          const yfov = this.yfov;
          const xfov = this.yfov * this.aspectRatio;

          const yZoom = maxAxisLength / 2 / Math.tan(yfov / 2);
          const xZoom = maxAxisLength / 2 / Math.tan(xfov / 2);

          this.distance = Math.max(xZoom, yZoom);
          this.baseDistance = this.distance;
      }

      fitCameraTargetToExtents(min, max)
      {
          let target = [0,0,0];
          for (const i of [0, 1, 2])
          {
              target[i] = (max[i] + min[i]) / 2;
          }
          this.setRotation(this.rotAroundY, this.rotAroundX);
          this.setDistanceFromTarget(this.distance, target);
      }

      fitCameraPlanesToExtents(min, max)
      {
          // depends only on scene min/max and the camera distance

          // Manually increase scene extent just for the camera planes to avoid camera clipping in most situations.
          const longestDistance = 10 * distance(min, max);
          let zNear = this.distance - (longestDistance * 0.6);
          let zFar = this.distance + (longestDistance * 0.6);

          // minimum near plane value needs to depend on far plane value to avoid z fighting or too large near planes
          zNear = Math.max(zNear, zFar / MaxNearFarRatio);

          this.znear = zNear;
          this.zfar = zFar;
      }
  }

  /**
   * GltfState containing a state for visualization in GltfView
   */
  class GltfState
  {
      /**
       * GltfState represents all state that can be visualized in a view. You could have
       * multiple GltfStates configured and switch between them on demand.
       * @param {*} view GltfView to which this state belongs
       */
      constructor(view)
      {
          /** loaded gltf data @see ResourceLoader.loadGltf */
          this.gltf = undefined;
          /** loaded environment data @see ResourceLoader.loadEnvironment */
          this.environment = undefined;
          /** user camera @see UserCamera, convenient camera controls */
          this.userCamera = new UserCamera();
          /** gltf scene that is visible in the view */
          this.sceneIndex = 0;
          /**
           * index of the camera that is used to render the view. a
           * value of 'undefined' enables the user camera
           */
          this.cameraIndex = undefined;
          /** indices of active animations */
          this.animationIndices = [];
          /** animation timer allows to control the animation time */
          this.animationTimer = new AnimationTimer();
          /** KHR_materials_variants */
          this.variant = undefined;

          /** parameters used to configure the rendering */
          this.renderingParameters = {
              /** morphing between vertices */
              morphing: true,
              /** skin / skeleton */
              skinning: true,

              enabledExtensions: {
                  /** KHR_materials_clearcoat */
                  KHR_materials_clearcoat: true,
                  /** KHR_materials_sheen */
                  KHR_materials_sheen: true,
                  /** KHR_materials_transmission */
                  KHR_materials_transmission: true,
                  /** KHR_materials_volume */
                  KHR_materials_volume: true,
                  /** KHR_materials_ior makes the index of refraction configurable */
                  KHR_materials_ior: true,
                  /** KHR_materials_specular allows configuring specular color (f0 color) and amount of specular reflection */
                  KHR_materials_specular: true,
              },
              /** clear color expressed as list of ints in the range [0, 255] */
              clearColor: [58, 64, 74, 255],
              /** exposure factor */
              exposure: 1.0,
              /** KHR_lights_punctual */
              usePunctual: true,
              /** image based lighting */
              useIBL: true,
              /** render the environment map in the background */
              renderEnvironmentMap: true,
              /** apply blur to the background environment map */
              blurEnvironmentMap: true,
              /** which tonemap to use, use ACES for a filmic effect */
              toneMap: GltfState.ToneMaps.LINEAR,
              /** render some debug output channes, such as for example the normals */
              debugOutput: GltfState.DebugOutput.NONE,
              /**
               * By default the front face of the environment is +Z (90)
               * Front faces:
               * +X = 0 
               * +Z = 90 
               * -X = 180 
               * -Z = 270
               */
              environmentRotation: 90.0,
              /** If this is set to true, directional lights will be generated if IBL is disabled */
              useDirectionalLightsWithDisabledIBL: false
          };

          // retain a reference to the view with which the state was created, so that it can be validated
          this._view = view;
      }
  }

  /** 
   * ToneMaps enum for the different tonemappings that are supported 
   * by gltf sample viewer
  */
  GltfState.ToneMaps = {
      /** don't apply tone mapping */
      NONE: "None",
      /** ACES sRGB RRT+ODT implementation for 3D Commerce based on Stephen Hill's implementation with a exposure factor of 1.0 / 0.6 */
      ACES_3D_COMMERCE: "ACES Filmic Tone Mapping (3D Commerce)",
      /** fast implementation of the ACES sRGB RRT+ODT based on Krzysztof Narkowicz' implementation*/
      ACES_NARKOWICZ: "ACES Filmic Tone Mapping (Narkowicz)",
      /** more accurate implementation of the ACES sRGB RRT+ODT based on Stephen Hill's implementation*/
      ACES_HILL: "ACES Filmic Tone Mapping (Hill)",
  };

  /**
   * DebugOutput enum for selecting debug output channels
   * such as "NORMAL"
   */
  GltfState.DebugOutput = {
      /** standard rendering - debug output is disabled */
      NONE: "None",
      /** output the metallic value from pbr metallic roughness */
      METALLIC: "Metallic",
      /** output the roughness value from pbr metallic roughness */
      ROUGHNESS: "Roughness",
      /** output the normal map value in TBN space */
      NORMAL: "Normal",
      /** output the world space normals (i.e. with TBN applied) */
      WORLDSPACENORMAL: "Worldspace Normal",
      /** output the normal from the TBN*/
      GEOMETRYNORMAL: "Geometry Normal",
      /** output the tangent from the TBN*/
      TANGENT: "Tangent",
      /** output the bitangent from the TBN */
      BITANGENT: "Bitangent",
      /** output the base color value */
      BASECOLOR: "Base Color",
      /** output the occlusion value */
      OCCLUSION: "Occlusion",
      /** output the emissive value */
      EMISSIVE: "Emissive",
      /** output diffuse lighting */
      DIFFUSE: "Diffuse",
      /** output specular lighting */
      SPECULAR: "Specular",
      /** output clearcoat lighting */
      CLEARCOAT: "ClearCoat",
      /** output sheen lighting */
      SHEEN: "Sheen",
      /** output tranmission lighting */
      TRANSMISSION: "Transmission",
      /** output the alpha value */
      ALPHA: "Alpha",
      /** output computed F0 */
      F0: "F0"
  };

  const ImageMimeType = {JPEG: "image/jpeg", PNG: "image/png", HDR: "image/vnd.radiance", KTX2: "image/ktx2", GLTEXTURE: "image/texture"};

  let GL = undefined;

  class gltfWebGl
  {
      constructor(context)
      {
          this.context = context;
          if(GL === undefined)
          {
              GL = context;
          }
      }

      loadWebGlExtensions(webglExtensions)
      {
          for (let extension of webglExtensions)
          {
              if (this.context.getExtension(extension) === null)
              {
                  console.warn("Extension " + extension + " not supported!");
              }
          }

          let EXT_texture_filter_anisotropic = this.context.getExtension("EXT_texture_filter_anisotropic");

          if (EXT_texture_filter_anisotropic)
          {
              this.context.anisotropy = EXT_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT;
              this.context.maxAnisotropy = this.context.getParameter(EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
              this.context.supports_EXT_texture_filter_anisotropic = true;
          }
          else
          {
              this.context.supports_EXT_texture_filter_anisotropic = false;
          }
      }

      setTexture(loc, gltf, textureInfo, texSlot)
      {
          if (loc === -1)
          {
              return false;
          }

          let gltfTex = gltf.textures[textureInfo.index];

          if (gltfTex === undefined)
          {
              console.warn("Texture is undefined: " + textureInfo.index);
              return false;
          }

          const image = gltf.images[gltfTex.source];
          if (image === undefined)
          {
              console.warn("Image is undefined for texture: " + gltfTex.source);
              return false;
          }

          if (gltfTex.glTexture === undefined)
          {
              if (image.mimeType === ImageMimeType.KTX2 ||
                  image.mimeType === ImageMimeType.GLTEXTURE)
              {
                  // these image resources are directly loaded to a GPU resource by resource loader
                  gltfTex.glTexture = image.image;
              }
              else
              {
                  // other images will be uploaded in a later step
                  gltfTex.glTexture = this.context.createTexture();
              }
          }

          this.context.activeTexture(GL.TEXTURE0 + texSlot);
          this.context.bindTexture(gltfTex.type, gltfTex.glTexture);

          this.context.uniform1i(loc, texSlot);

          if (!gltfTex.initialized)
          {
              const gltfSampler = gltf.samplers[gltfTex.sampler];

              if (gltfSampler === undefined)
              {
                  console.warn("Sampler is undefined for texture: " + textureInfo.index);
                  return false;
              }

              this.context.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, false);

              // upload images that are not directly loaded as GPU resource
              if (image.mimeType === ImageMimeType.PNG ||
                  image.mimeType === ImageMimeType.JPEG ||
                  image.mimeType === ImageMimeType.HDR)
              {
                  // the check `GL.SRGB8_ALPHA8 === undefined` is needed as at the moment node-gles does not define the full format enum
                  const internalformat = (textureInfo.linear || GL.SRGB8_ALPHA8 === undefined) ? GL.RGBA : GL.SRGB8_ALPHA8;
                  this.context.texImage2D(image.type, image.miplevel, internalformat, GL.RGBA, GL.UNSIGNED_BYTE, image.image);
              }

              this.setSampler(gltfSampler, gltfTex.type, textureInfo.generateMips);

              if (textureInfo.generateMips)
              {
                  switch (gltfSampler.minFilter)
                  {
                  case GL.NEAREST_MIPMAP_NEAREST:
                  case GL.NEAREST_MIPMAP_LINEAR:
                  case GL.LINEAR_MIPMAP_NEAREST:
                  case GL.LINEAR_MIPMAP_LINEAR:
                      this.context.generateMipmap(gltfTex.type);
                      break;
                  }
              }

              gltfTex.initialized = true;
          }

          return gltfTex.initialized;
      }

      setIndices(gltf, accessorIndex)
      {
          let gltfAccessor = gltf.accessors[accessorIndex];

          if (gltfAccessor.glBuffer === undefined)
          {
              gltfAccessor.glBuffer = this.context.createBuffer();

              let data = gltfAccessor.getTypedView(gltf);

              if (data === undefined)
              {
                  return false;
              }

              this.context.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gltfAccessor.glBuffer);
              this.context.bufferData(GL.ELEMENT_ARRAY_BUFFER, data, GL.STATIC_DRAW);
          }
          else
          {
              this.context.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gltfAccessor.glBuffer);
          }

          return true;
      }

      enableAttribute(gltf, attributeLocation, gltfAccessor)
      {
          if (attributeLocation === -1)
          {
              console.warn("Tried to access unknown attribute");
              return false;
          }

          if(gltfAccessor.bufferView === undefined)
          {
              console.warn("Tried to access undefined bufferview");
              return true;
          }

          let gltfBufferView = gltf.bufferViews[gltfAccessor.bufferView];

          if (gltfAccessor.glBuffer === undefined)
          {
              gltfAccessor.glBuffer = this.context.createBuffer();

              let data = gltfAccessor.getTypedView(gltf);

              if (data === undefined)
              {
                  return false;
              }

              this.context.bindBuffer(GL.ARRAY_BUFFER, gltfAccessor.glBuffer);
              this.context.bufferData(GL.ARRAY_BUFFER, data, GL.STATIC_DRAW);
          }
          else
          {
              this.context.bindBuffer(GL.ARRAY_BUFFER, gltfAccessor.glBuffer);
          }

          this.context.vertexAttribPointer(attributeLocation, gltfAccessor.getComponentCount(gltfAccessor.type), gltfAccessor.componentType, gltfAccessor.normalized, gltfBufferView.byteStride, 0);
          this.context.enableVertexAttribArray(attributeLocation);

          return true;
      }

      compileShader(shaderIdentifier, isVert, shaderSource)
      {
          const shader = this.context.createShader(isVert ? GL.VERTEX_SHADER : GL.FRAGMENT_SHADER);
          this.context.shaderSource(shader, shaderSource);
          this.context.compileShader(shader);
          const compiled = this.context.getShaderParameter(shader, GL.COMPILE_STATUS);

          if (!compiled)
          {
              // output surrounding source code
              let info = "";
              const messages = this.context.getShaderInfoLog(shader).split("\n");
              for(const message of messages)
              {
                  info += message + "\n";
                  const matches = message.match(/(?:(?:WARNING)|(?:ERROR)): [0-9]*:([0-9]*).*/i);
                  if (matches && matches.length > 1)
                  {
                      const lineNumber = parseInt(matches[1]) - 1;
                      const lines = shaderSource.split("\n");

                      for(let i = Math.max(0, lineNumber - 2); i < Math.min(lines.length, lineNumber + 3); i++)
                      {
                          if (lineNumber === i)
                          {
                              info += "->";
                          }
                          info += "\t" + lines[i] + "\n";
                      }
                  }
              }

              throw new Error("Could not compile WebGL program '" + shaderIdentifier + "': " + info);
          }

          return shader;
      }

      linkProgram(vertex, fragment)
      {
          let program = this.context.createProgram();
          this.context.attachShader(program, vertex);
          this.context.attachShader(program, fragment);
          this.context.linkProgram(program);

          if (!this.context.getProgramParameter(program, GL.LINK_STATUS))
          {
              var info = this.context.getProgramInfoLog(program);
              throw new Error('Could not link WebGL program. \n\n' + info);
          }

          return program;
      }

      //https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
      setSampler(gltfSamplerObj, type, generateMipmaps) // TEXTURE_2D
      {
          if (generateMipmaps)
          {
              this.context.texParameteri(type, GL.TEXTURE_WRAP_S, gltfSamplerObj.wrapS);
              this.context.texParameteri(type, GL.TEXTURE_WRAP_T, gltfSamplerObj.wrapT);
          }
          else
          {
              this.context.texParameteri(type, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
              this.context.texParameteri(type, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
          }

          // If not mip-mapped, force to non-mip-mapped sampler.
          if (!generateMipmaps && (gltfSamplerObj.minFilter != GL.NEAREST) && (gltfSamplerObj.minFilter != GL.LINEAR))
          {
              if ((gltfSamplerObj.minFilter == GL.NEAREST_MIPMAP_NEAREST) || (gltfSamplerObj.minFilter == GL.NEAREST_MIPMAP_LINEAR))
              {
                  this.context.texParameteri(type, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
              }
              else
              {
                  this.context.texParameteri(type, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
              }
          }
          else
          {
              this.context.texParameteri(type, GL.TEXTURE_MIN_FILTER, gltfSamplerObj.minFilter);
          }
          this.context.texParameteri(type, GL.TEXTURE_MAG_FILTER, gltfSamplerObj.magFilter);

          if (this.context.supports_EXT_texture_filter_anisotropic)
          {
              this.context.texParameterf(type, this.context.anisotropy, this.context.maxAnisotropy); // => 16xAF
          }
      }
  }

  class gltfShader
  {
      constructor(program, hash, gl)
      {
          this.program = program;
          this.hash = hash;
          this.uniforms = new Map();
          this.attributes = new Map();
          this.unknownAttributes = [];
          this.unknownUniforms = [];
          this.gl = gl;

          if(this.program !== undefined)
          {
              const uniformCount = this.gl.context.getProgramParameter(this.program, GL.ACTIVE_UNIFORMS);
              for(let i = 0; i < uniformCount; ++i)
              {
                  const info = this.gl.context.getActiveUniform(this.program, i);
                  const loc = this.gl.context.getUniformLocation(this.program, info.name);
                  this.uniforms.set(info.name, {type: info.type, loc: loc});
              }

              const attribCount = this.gl.context.getProgramParameter(this.program, GL.ACTIVE_ATTRIBUTES);
              for(let i = 0; i < attribCount; ++i)
              {
                  const info = this.gl.context.getActiveAttrib(this.program, i);
                  const loc = this.gl.context.getAttribLocation(this.program, info.name);
                  this.attributes.set(info.name, loc);
              }
          }
      }

      destroy()
      {
          if (this.program !== undefined)
          {
              this.deleteProgram(this.program);
          }

          this.program = undefined;
      }

      getAttributeLocation(name)
      {
          const loc = this.attributes.get(name);
          if (loc === undefined)
          {
              if (this.unknownAttributes.find(n => n === name) === undefined)
              {
                  console.log("Attribute '%s' does not exist", name);
                  this.unknownAttributes.push(name);
              }
              return -1;
          }
          return loc;
      }

      getUniformLocation(name)
      {
          const uniform = this.uniforms.get(name);
          if (uniform === undefined)
          {
              if (this.unknownUniforms.find(n => n === name) === undefined)
              {
                  this.unknownUniforms.push(name);
              }
              return -1;
          }
          return uniform.loc;
      }

      updateUniform(objectName, object, log = true)
      {
          if (object instanceof UniformStruct)
          {
              this.updateUniformStruct(objectName, object, log);
          }
          else if (Array.isArray(object))
          {
              this.updateUniformArray(objectName, object, log);
          }
          else
          {
              this.updateUniformValue(objectName, object, log);
          }
      }

      updateUniformArray(arrayName, array, log)
      {
          if(array[0] instanceof UniformStruct)
          {
              for (let i = 0; i < array.length; ++i)
              {
                  let element = array[i];
                  let uniformName = arrayName + "[" + i + "]";
                  this.updateUniform(uniformName, element, log);
              }
          }else {
              let uniformName = arrayName + "[0]";

              let flat = [];

              if(Array.isArray(array[0]) || array[0].length !== undefined)
              {
                  for (let i = 0; i < array.length; ++i)
                  {
                      flat.push.apply(flat, Array.from(array[i]));
                  }
              }
              else
              {
                  flat = array;
              }

              if(flat.length === 0)
              {
                  console.error("Failed to flatten uniform array " + uniformName);
                  return;
              }

              this.updateUniformValue(uniformName, flat, log);
          }
      }

      updateUniformStruct(structName, object, log)
      {
          let memberNames = Object.keys(object);
          for (let memberName of memberNames)
          {
              let uniformName = structName + "." + memberName;
              this.updateUniform(uniformName, object[memberName], log);
          }
      }

      // upload the values of a uniform with the given name using type resolve to get correct function call
      updateUniformValue(uniformName, value, log)
      {
          const uniform = this.uniforms.get(uniformName);

          if(uniform !== undefined)
          {
              switch (uniform.type) {
              case GL.FLOAT:
              {
                  if(Array.isArray(value) || value instanceof Float32Array)
                  {
                      this.gl.context.uniform1fv(uniform.loc, value);
                  }else {
                      this.gl.context.uniform1f(uniform.loc, value);
                  }
                  break;
              }
              case GL.FLOAT_VEC2: this.gl.context.uniform2fv(uniform.loc, value); break;
              case GL.FLOAT_VEC3: this.gl.context.uniform3fv(uniform.loc, value); break;
              case GL.FLOAT_VEC4: this.gl.context.uniform4fv(uniform.loc, value); break;

              case GL.INT:
              {
                  if(Array.isArray(value) || value instanceof Uint32Array || value instanceof Int32Array)
                  {
                      this.gl.context.uniform1iv(uniform.loc, value);
                  }else {
                      this.gl.context.uniform1i(uniform.loc, value);
                  }
                  break;
              }
              case GL.INT_VEC2: this.gl.context.uniform2iv(uniform.loc, value); break;
              case GL.INT_VEC3: this.gl.context.uniform3iv(uniform.loc, value); break;
              case GL.INT_VEC4: this.gl.context.uniform4iv(uniform.loc, value); break;

              case GL.FLOAT_MAT2: this.gl.context.uniformMatrix2fv(uniform.loc, false, value); break;
              case GL.FLOAT_MAT3: this.gl.context.uniformMatrix3fv(uniform.loc, false, value); break;
              case GL.FLOAT_MAT4: this.gl.context.uniformMatrix4fv(uniform.loc, false, value); break;
              }
          }
          else if(log)
          {
              console.warn("Unkown uniform: " + uniformName);
          }
      }
  }

  // THis class generates and caches the shader source text for a given permutation
  class ShaderCache
  {
      constructor(sources, gl)
      {
          this.sources  = sources; // shader name -> source code
          this.shaders  = new Map(); // name & permutations hashed -> compiled shader
          this.programs = new Map(); // (vertex shader, fragment shader) -> program
          this.gl = gl;

          // resovle / expande sources (TODO: break include cycles)
          for (let [key, src] of this.sources)
          {
              let changed = false;
              for (let [includeName, includeSource] of this.sources)
              {
                  //var pattern = RegExp(/#include</ + includeName + />/);
                  const pattern = "#include <" + includeName + ">";

                  if(src.includes(pattern))
                  {
                      // only replace the first occurance
                      src = src.replace(pattern, includeSource);

                      // remove the others
                      while (src.includes(pattern))
                      {
                          src = src.replace(pattern, "");
                      }

                      changed = true;
                  }
              }

              if(changed)
              {
                  this.sources.set(key, src);
              }
          }
      }

      destroy()
      {
          for (let [, shader] of this.shaders.entries())
          {
              this.gl.context.deleteShader(shader);
              shader = undefined;
          }

          this.shaders.clear();

          for (let [, program] of this.programs)
          {
              program.destroy();
          }

          this.programs.clear();
      }

      // example args: "pbr.vert", ["NORMALS", "TANGENTS"]
      selectShader(shaderIdentifier, permutationDefines)
      {
          // first check shaders for the exact permutation
          // if not present, check sources and compile it
          // if not present, return null object

          const src = this.sources.get(shaderIdentifier);
          if(src === undefined)
          {
              console.log("Shader source for " + shaderIdentifier + " not found");
              return null;
          }

          const isVert = shaderIdentifier.endsWith(".vert");
          let hash = stringHash(shaderIdentifier);

          // console.log(shaderIdentifier);

          let defines = "#version 300 es\n";
          for(let define of permutationDefines)
          {
              // console.log(define);
              hash ^= stringHash(define);
              defines += "#define " + define + "\n";
          }

          let shader = this.shaders.get(hash);

          if(shader === undefined)
          {
              // console.log(defines);
              // compile this variant
              shader = this.gl.compileShader(shaderIdentifier, isVert, defines + src);
              this.shaders.set(hash, shader);
          }

          return hash;
      }

      getShaderProgram(vertexShaderHash, fragmentShaderHash)
      {
          const hash = combineHashes(vertexShaderHash, fragmentShaderHash);

          let program = this.programs.get(hash);

          if (program) // program already linked
          {
              return program;
          }
          else // link this shader program type!
          {
              let linkedProg = this.gl.linkProgram(this.shaders.get(vertexShaderHash), this.shaders.get(fragmentShaderHash));
              if(linkedProg)
              {
                  let program = new gltfShader(linkedProg, hash, this.gl);
                  this.programs.set(hash, program);
                  return program;
              }
          }

          return undefined;
      }
  }

  class EnvironmentRenderer
  {
      constructor(webgl)
      {
          const gl = webgl.context;

          this.indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
              1, 2, 0,
              2, 3, 0,
              6, 2, 1,
              1, 5, 6,
              6, 5, 4,
              4, 7, 6,
              6, 3, 2,
              7, 3, 6,
              3, 7, 0,
              7, 4, 0,
              5, 1, 0,
              4, 5, 0
          ]), gl.STATIC_DRAW);

          this.vertexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
              -1, -1, -1,
               1, -1, -1,
               1,  1, -1,
              -1,  1, -1,
              -1, -1,  1,
               1, -1,  1,
               1,  1,  1,
              -1,  1,  1
          ]), gl.STATIC_DRAW);
      }

      drawEnvironmentMap(webGl, viewProjectionMatrix, state, shaderCache, fragDefines)
      {
          if (state.environment == undefined || state.renderingParameters.renderEnvironmentMap == false)
          {
              return;
          }

          const gl = webGl.context;

          const vertShader = shaderCache.selectShader("cubemap.vert", []);
          const fragShader = shaderCache.selectShader("cubemap.frag", fragDefines);
          const shader = shaderCache.getShaderProgram(vertShader, fragShader);

          gl.useProgram(shader.program);
          webGl.setTexture(shader.getUniformLocation("u_specularEnvSampler"), state.environment, state.environment.specularEnvMap, 0);
          shader.updateUniform("u_MipCount", state.environment.mipCount);
          shader.updateUniform("u_envBlurNormalized", state.renderingParameters.blurEnvironmentMap ? 0.6 : 0.0);

          shader.updateUniform("u_ViewProjectionMatrix", viewProjectionMatrix);
          shader.updateUniform("u_Exposure", state.renderingParameters.exposure, false);

          let rotMatrix4 = create$1();
          rotateY(rotMatrix4, rotMatrix4,  state.renderingParameters.environmentRotation / 180.0 * Math.PI);
          let rotMatrix3 = create();
          fromMat4(rotMatrix3, rotMatrix4);
          shader.updateUniform("u_envRotation", rotMatrix3);

          gl.frontFace(gl.CCW);
          gl.enable(gl.CULL_FACE);
          gl.disable(gl.BLEND);
          gl.disable(gl.DEPTH_TEST);

          const positionAttributeLocation = shader.getAttributeLocation("a_position");
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
          gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(positionAttributeLocation);
          gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

          gl.enable(gl.DEPTH_TEST);
      }
  }

  var pbrShader = "//\n// This fragment shader defines a reference implementation for Physically Based Shading of\n// a microfacet surface material defined by a glTF model.\n//\n// References:\n// [1] Real Shading in Unreal Engine 4\n//     http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf\n// [2] Physically Based Shading at Disney\n//     http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_notes_v3.pdf\n// [3] README.md - Environment Maps\n//     https://github.com/KhronosGroup/glTF-WebGL-PBR/#environment-maps\n// [4] \"An Inexpensive BRDF Model for Physically based Rendering\" by Christophe Schlick\n//     https://www.cs.virginia.edu/~jdl/bib/appearance/analytic%20models/schlick94b.pdf\n// [5] \"KHR_materials_clearcoat\"\n//     https://github.com/ux3d/glTF/tree/KHR_materials_pbrClearcoat/extensions/2.0/Khronos/KHR_materials_clearcoat\n\nprecision highp float;\n#define GLSLIFY 1\n\n#include <tonemapping.glsl>\n#include <textures.glsl>\n#include <functions.glsl>\n#include <brdf.glsl>\n#include <punctual.glsl>\n#include <ibl.glsl>\n\nout vec4 g_finalColor;\n\n#ifdef USE_PUNCTUAL\nuniform Light u_Lights[LIGHT_COUNT + 1]; //Array [0] is not allowed\n#endif\n\n// Metallic Roughness\nuniform float u_MetallicFactor;\nuniform float u_RoughnessFactor;\nuniform vec4 u_BaseColorFactor;\n\n// Specular Glossiness\nuniform vec3 u_SpecularFactor;\nuniform vec4 u_DiffuseFactor;\nuniform float u_GlossinessFactor;\n\n// Sheen\nuniform float u_SheenRoughnessFactor;\nuniform vec3 u_SheenColorFactor;\n\n// Clearcoat\nuniform float u_ClearcoatFactor;\nuniform float u_ClearcoatRoughnessFactor;\n\n// Specular\nuniform vec3 u_KHR_materials_specular_specularColorFactor;\nuniform float u_KHR_materials_specular_specularFactor;\n\n// Transmission\nuniform float u_TransmissionFactor;\n\n// Volume\nuniform float u_ThicknessFactor;\nuniform vec3 u_AttenuationColor;\nuniform float u_AttenuationDistance;\n\n//PBR Next IOR\nuniform float u_ior;\n\n// Alpha mode\nuniform float u_AlphaCutoff;\n\nuniform vec3 u_Camera;\n\n#ifdef MATERIAL_TRANSMISSION\nuniform ivec2 u_ScreenSize;\n#endif\n\nuniform mat4 u_ModelMatrix;\nuniform mat4 u_ViewMatrix;\nuniform mat4 u_ProjectionMatrix;\n\nstruct MaterialInfo\n{\n    float ior;\n    float perceptualRoughness;      // roughness value, as authored by the model creator (input to shader)\n    vec3 f0;                        // full reflectance color (n incidence angle)\n\n    float alphaRoughness;           // roughness mapped to a more linear change in the roughness (proposed by [2])\n    vec3 albedoColor;\n\n    vec3 f90;                       // reflectance color at grazing angle\n    float metallic;\n\n    vec3 n;\n    vec3 baseColor; // getBaseColor()\n\n    float sheenRoughnessFactor;\n    vec3 sheenColorFactor;\n\n    vec3 clearcoatF0;\n    vec3 clearcoatF90;\n    float clearcoatFactor;\n    vec3 clearcoatNormal;\n    float clearcoatRoughness;\n\n    vec3 specularColor;\n    float specular;\n\n    float transmissionFactor;\n\n    float thickness;\n    vec3 attenuationColor;\n    float attenuationDistance;\n};\n\n// Get normal, tangent and bitangent vectors.\nNormalInfo getNormalInfo(vec3 v)\n{\n    vec2 UV = getNormalUV();\n    vec3 uv_dx = dFdx(vec3(UV, 0.0));\n    vec3 uv_dy = dFdy(vec3(UV, 0.0));\n\n    vec3 t_ = (uv_dy.t * dFdx(v_Position) - uv_dx.t * dFdy(v_Position)) /\n        (uv_dx.s * uv_dy.t - uv_dy.s * uv_dx.t);\n\n    vec3 n, t, b, ng;\n\n    // Compute geometrical TBN:\n    #ifdef HAS_TANGENTS\n        // Trivial TBN computation, present as vertex attribute.\n        // Normalize eigenvectors as matrix is linearly interpolated.\n        t = normalize(v_TBN[0]);\n        b = normalize(v_TBN[1]);\n        ng = normalize(v_TBN[2]);\n    #else\n        // Normals are either present as vertex attributes or approximated.\n        #ifdef HAS_NORMALS\n            ng = normalize(v_Normal);\n        #else\n            ng = normalize(cross(dFdx(v_Position), dFdy(v_Position)));\n        #endif\n\n        t = normalize(t_ - ng * dot(ng, t_));\n        b = cross(ng, t);\n    #endif\n\n    // For a back-facing surface, the tangential basis vectors are negated.\n    if (gl_FrontFacing == false)\n    {\n        t *= -1.0;\n        b *= -1.0;\n        ng *= -1.0;\n    }\n\n    // Compute pertubed normals:\n    #ifdef HAS_NORMAL_MAP\n        n = texture(u_NormalSampler, UV).rgb * 2.0 - vec3(1.0);\n        n *= vec3(u_NormalScale, u_NormalScale, 1.0);\n        n = mat3(t, b, ng) * normalize(n);\n    #else\n        n = ng;\n    #endif\n\n    NormalInfo info;\n    info.ng = ng;\n    info.t = t;\n    info.b = b;\n    info.n = n;\n    return info;\n}\n\nvec3 getClearcoatNormal(NormalInfo normalInfo)\n{\n    #ifdef HAS_CLEARCOAT_NORMAL_MAP\n        vec3 n = texture(u_ClearcoatNormalSampler, getClearcoatNormalUV()).rgb * 2.0 - vec3(1.0);\n        n *= vec3(u_ClearcoatNormalScale, u_ClearcoatNormalScale, 1.0);\n        n = mat3(normalInfo.t, normalInfo.b, normalInfo.ng) * normalize(n);\n        return n;\n    #else\n        return normalInfo.ng;\n    #endif\n}\n\nvec4 getBaseColor()\n{\n    vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    #if defined(MATERIAL_SPECULARGLOSSINESS)\n        baseColor = u_DiffuseFactor;\n    #elif defined(MATERIAL_METALLICROUGHNESS)\n        baseColor = u_BaseColorFactor;\n    #endif\n\n    #if defined(MATERIAL_SPECULARGLOSSINESS) && defined(HAS_DIFFUSE_MAP)\n        baseColor *= texture(u_DiffuseSampler, getDiffuseUV());\n    #elif defined(MATERIAL_METALLICROUGHNESS) && defined(HAS_BASE_COLOR_MAP)\n        baseColor *= texture(u_BaseColorSampler, getBaseColorUV());\n    #endif\n\n    return baseColor * getVertexColor();\n}\n\nMaterialInfo getSpecularGlossinessInfo(MaterialInfo info)\n{\n    info.f0 = u_SpecularFactor;\n    info.perceptualRoughness = u_GlossinessFactor;\n\n#ifdef HAS_SPECULAR_GLOSSINESS_MAP\n    vec4 sgSample = texture(u_SpecularGlossinessSampler, getSpecularGlossinessUV());\n    info.perceptualRoughness *= sgSample.a ; // glossiness to roughness\n    info.f0 *= sgSample.rgb; // specular\n#endif // ! HAS_SPECULAR_GLOSSINESS_MAP\n\n    info.perceptualRoughness = 1.0 - info.perceptualRoughness; // 1 - glossiness\n    info.albedoColor = info.baseColor.rgb * (1.0 - max(max(info.f0.r, info.f0.g), info.f0.b));\n\n    return info;\n}\n\nMaterialInfo getMetallicRoughnessInfo(MaterialInfo info)\n{\n    info.metallic = u_MetallicFactor;\n    info.perceptualRoughness = u_RoughnessFactor;\n\n#ifdef HAS_METALLIC_ROUGHNESS_MAP\n    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.\n    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data\n    vec4 mrSample = texture(u_MetallicRoughnessSampler, getMetallicRoughnessUV());\n    info.perceptualRoughness *= mrSample.g;\n    info.metallic *= mrSample.b;\n#endif\n\n    // Achromatic f0 based on IOR.\n    vec3 f0 = info.f0;\n\n    info.albedoColor = mix(info.baseColor.rgb * (vec3(1.0) - f0),  vec3(0), info.metallic);\n    info.f0 = mix(f0, info.baseColor.rgb, info.metallic);\n\n    return info;\n}\n\nMaterialInfo getSheenInfo(MaterialInfo info)\n{\n    info.sheenColorFactor = u_SheenColorFactor;\n    info.sheenRoughnessFactor = u_SheenRoughnessFactor;\n\n    #ifdef HAS_SHEEN_COLOR_MAP\n        vec4 sheenColorSample = texture(u_SheenColorSampler, getSheenColorUV());\n        info.sheenColorFactor *= sheenColorSample.rgb;\n    #endif\n\n    #ifdef HAS_SHEEN_ROUGHNESS_MAP\n        vec4 sheenRoughnessSample = texture(u_SheenRoughnessSampler, getSheenRoughnessUV());\n        info.sheenRoughnessFactor *= sheenRoughnessSample.a;\n    #endif\n\n    return info;\n}\n\n#ifdef MATERIAL_SPECULAR\nMaterialInfo getSpecularInfo(MaterialInfo info)\n{   \n    vec4 specularTexture = vec4(1.0);\n    #ifdef HAS_SPECULAR_MAP\n        specularTexture.rgb = texture(u_SpecularColorSampler, getSpecularColorUV()).rgb;\n    #endif\n    #ifdef HAS_SPECULAR_COLOR_MAP\n        specularTexture.a = texture(u_SpecularSampler, getSpecularUV()).a;\n    #endif\n\n    vec3 dielectricSpecularF0 = min(info.f0 * u_KHR_materials_specular_specularColorFactor * specularTexture.rgb, vec3(1.0)) *\n                        u_KHR_materials_specular_specularFactor * specularTexture.a;\n\n    info.f0 = mix(dielectricSpecularF0, info.baseColor.rgb, info.metallic);\n    info.albedoColor = mix(info.baseColor.rgb * (1.0 - max3(dielectricSpecularF0)),  vec3(0), info.metallic);\n\n    return info;\n}\n#endif\n\n#ifdef MATERIAL_TRANSMISSION\nMaterialInfo getTransmissionInfo(MaterialInfo info)\n{\n    info.transmissionFactor = u_TransmissionFactor;\n\n    #ifdef HAS_TRANSMISSION_MAP\n        vec4 transmissionSample = texture(u_TransmissionSampler, getTransmissionUV());\n        info.transmissionFactor *= transmissionSample.r;\n    #endif\n\n    return info;\n}\n#endif\n\n#ifdef MATERIAL_VOLUME\nMaterialInfo getVolumeInfo(MaterialInfo info)\n{\n    info.thickness = u_ThicknessFactor;\n    info.attenuationColor = u_AttenuationColor;\n    info.attenuationDistance = u_AttenuationDistance;\n\n    #ifdef HAS_THICKNESS_MAP\n        vec4 thicknessSample = texture(u_ThicknessSampler, getThicknessUV());\n        info.thickness *= thicknessSample.g;\n    #endif\n\n    return info;\n}\n#endif\n\nMaterialInfo getClearCoatInfo(MaterialInfo info, NormalInfo normalInfo)\n{\n    info.clearcoatFactor = u_ClearcoatFactor;\n    info.clearcoatRoughness = u_ClearcoatRoughnessFactor;\n    info.clearcoatF0 = vec3(info.f0);\n    info.clearcoatF90 = vec3(1.0);\n\n    #ifdef HAS_CLEARCOAT_TEXTURE_MAP\n        vec4 clearcoatSample = texture(u_ClearcoatSampler, getClearcoatUV());\n        info.clearcoatFactor *= clearcoatSample.r;\n    #endif\n\n    #ifdef HAS_CLEARCOAT_ROUGHNESS_MAP\n        vec4 clearcoatSampleRoughness = texture(u_ClearcoatRoughnessSampler, getClearcoatRoughnessUV());\n        info.clearcoatRoughness *= clearcoatSampleRoughness.g;\n    #endif\n\n    info.clearcoatNormal = getClearcoatNormal(normalInfo);\n\n    info.clearcoatRoughness = clamp(info.clearcoatRoughness, 0.0, 1.0);\n\n    return info;\n}\n\n#ifdef MATERIAL_IOR\nMaterialInfo getIorInfo(MaterialInfo info)\n{\n    info.f0 = vec3(pow(( u_ior - 1.0f) /  (u_ior + 1.0f),2.0));\n    info.ior = u_ior;\n    \n    return info;\n}\n#endif\n\nfloat albedoSheenScalingLUT(float NdotV, float sheenRoughnessFactor)\n{\n    return texture(u_SheenELUT, vec2(NdotV, sheenRoughnessFactor)).r;\n}\n\nvoid main()\n{\n    vec4 baseColor = getBaseColor();\n\n#ifdef ALPHAMODE_OPAQUE\n    baseColor.a = 1.0;\n#endif\n\n#ifdef MATERIAL_UNLIT\n    g_finalColor = (vec4(linearTosRGB(baseColor.rgb), baseColor.a));\n    return;\n#endif\n\n    vec3 v = normalize(u_Camera - v_Position);\n    NormalInfo normalInfo = getNormalInfo(v);\n    vec3 n = normalInfo.n;\n    vec3 t = normalInfo.t;\n    vec3 b = normalInfo.b;\n\n    float NdotV = clampedDot(n, v);\n    float TdotV = clampedDot(t, v);\n    float BdotV = clampedDot(b, v);\n\n    MaterialInfo materialInfo;\n    materialInfo.baseColor = baseColor.rgb;\n    \n    // The default index of refraction of 1.5 yields a dielectric normal incidence reflectance of 0.04.\n    materialInfo.ior = 1.5;\n    materialInfo.f0 = vec3(0.04);\n#ifdef MATERIAL_IOR\n    materialInfo = getIorInfo(materialInfo);\n#endif\n\n#ifdef MATERIAL_SPECULARGLOSSINESS\n    materialInfo = getSpecularGlossinessInfo(materialInfo);\n#endif\n\n#ifdef MATERIAL_METALLICROUGHNESS\n    materialInfo = getMetallicRoughnessInfo(materialInfo);\n#endif\n\n#ifdef MATERIAL_SHEEN\n    materialInfo = getSheenInfo(materialInfo);\n#endif\n\n#ifdef MATERIAL_CLEARCOAT\n    materialInfo = getClearCoatInfo(materialInfo, normalInfo);\n#endif\n\n#ifdef MATERIAL_SPECULAR\n    materialInfo = getSpecularInfo(materialInfo);\n#endif\n\n#ifdef MATERIAL_TRANSMISSION\n    materialInfo = getTransmissionInfo(materialInfo);\n#endif\n\n#ifdef MATERIAL_VOLUME\n    materialInfo = getVolumeInfo(materialInfo);\n#endif\n\n    materialInfo.perceptualRoughness = clamp(materialInfo.perceptualRoughness, 0.0, 1.0);\n    materialInfo.metallic = clamp(materialInfo.metallic, 0.0, 1.0);\n\n    // Roughness is authored as perceptual roughness; as is convention,\n    // convert to material roughness by squaring the perceptual roughness.\n    materialInfo.alphaRoughness = materialInfo.perceptualRoughness * materialInfo.perceptualRoughness;\n\n    // Compute reflectance.\n    float reflectance = max(max(materialInfo.f0.r, materialInfo.f0.g), materialInfo.f0.b);\n\n    // Anything less than 2% is physically impossible and is instead considered to be shadowing. Compare to \"Real-Time-Rendering\" 4th editon on page 325.\n    materialInfo.f90 = vec3(1.0f);\n\n    materialInfo.n = n;\n\n    // LIGHTING\n    vec3 f_specular = vec3(0.0);\n    vec3 f_diffuse = vec3(0.0);\n    vec3 f_emissive = vec3(0.0);\n    vec3 f_clearcoat = vec3(0.0);\n    vec3 f_sheen = vec3(0.0);\n    vec3 f_transmission = vec3(0.0);\n\n    float albedoSheenScaling = 1.0;\n\n    // Calculate lighting contribution from image based lighting source (IBL)\n#ifdef USE_IBL\n    f_specular += getIBLRadianceGGX(n, v, materialInfo.perceptualRoughness, materialInfo.f0);\n    f_diffuse += getIBLRadianceLambertian(n, v, materialInfo.perceptualRoughness, materialInfo.albedoColor, materialInfo.f0);\n\n    #ifdef MATERIAL_CLEARCOAT\n        f_clearcoat += getIBLRadianceGGX(materialInfo.clearcoatNormal, v, materialInfo.clearcoatRoughness, materialInfo.clearcoatF0);\n    #endif\n\n    #ifdef MATERIAL_SHEEN\n        f_sheen += getIBLRadianceCharlie(n, v, materialInfo.sheenRoughnessFactor, materialInfo.sheenColorFactor);\n    #endif\n\n#endif\n\n#if (defined(MATERIAL_TRANSMISSION) || defined(MATERIAL_VOLUME)) && (defined(USE_PUNCTUAL) || defined(USE_IBL))\n    vec2 normalizedFragCoord = vec2(0.0,0.0);\n    normalizedFragCoord.x = gl_FragCoord.x/float(u_ScreenSize.x);\n    normalizedFragCoord.y = gl_FragCoord.y/float(u_ScreenSize.y);\n\n    f_transmission += materialInfo.transmissionFactor * getIBLVolumeRefraction(\n        n, v,\n        materialInfo.perceptualRoughness,\n        materialInfo.baseColor, materialInfo.f0, materialInfo.f90,\n        v_Position, u_ModelMatrix, u_ViewMatrix, u_ProjectionMatrix,\n        materialInfo.ior, materialInfo.thickness, materialInfo.attenuationColor, materialInfo.attenuationDistance\n    );\n#endif\n    float ao = 1.0;\n    // Apply optional PBR terms for additional (optional) shading\n#ifdef HAS_OCCLUSION_MAP\n    ao = texture(u_OcclusionSampler,  getOcclusionUV()).r;\n    f_diffuse = mix(f_diffuse, f_diffuse * ao, u_OcclusionStrength);\n    // apply ambient occlusion to all lighting that is not punctual\n    f_specular = mix(f_specular, f_specular * ao, u_OcclusionStrength);\n    f_sheen = mix(f_sheen, f_sheen * ao, u_OcclusionStrength);\n    f_clearcoat = mix(f_clearcoat, f_clearcoat * ao, u_OcclusionStrength);\n#endif\n\n#ifdef USE_PUNCTUAL\n    for (int i = 0; i < LIGHT_COUNT; ++i)\n    {\n        Light light = u_Lights[i];\n\n        vec3 pointToLight;\n        if(light.type != LightType_Directional)\n        {\n            pointToLight = light.position - v_Position;\n        }\n        else\n        {\n            pointToLight = -light.direction;\n        }\n\n        // BRDF = BDTF + BSTF:\n        vec3 l = normalize(pointToLight);   // Direction from surface point to light\n        vec3 h = normalize(l + v);          // Direction of the vector between l and v, called halfway vector\n        float NdotL = clampedDot(n, l);\n        float NdotV = clampedDot(n, v);\n        float NdotH = clampedDot(n, h);\n        float LdotH = clampedDot(l, h);\n        float VdotH = clampedDot(v, h);\n        if (NdotL > 0.0 || NdotV > 0.0)\n        {\n            // Calculation of analytical light\n            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB\n            vec3 intensity = getLighIntensity(light, pointToLight);\n            f_diffuse += intensity * NdotL *  BRDF_lambertian(materialInfo.f0, materialInfo.f90, materialInfo.albedoColor, VdotH);\n            f_specular += intensity * NdotL * BRDF_specularGGX(materialInfo.f0, materialInfo.f90, materialInfo.alphaRoughness, VdotH, NdotL, NdotV, NdotH);\n\n            #ifdef MATERIAL_SHEEN\n                f_sheen += intensity * getPunctualRadianceSheen(materialInfo.sheenColorFactor, materialInfo.sheenRoughnessFactor, NdotL, NdotV, NdotH);\n                albedoSheenScaling = min(1.0 - max3(materialInfo.sheenColorFactor) * albedoSheenScalingLUT(NdotV, materialInfo.sheenRoughnessFactor),\n                    1.0 - max3(materialInfo.sheenColorFactor) * albedoSheenScalingLUT(NdotL, materialInfo.sheenRoughnessFactor));\n            #endif\n\n            #ifdef MATERIAL_CLEARCOAT\n                f_clearcoat += intensity * getPunctualRadianceClearCoat(materialInfo.clearcoatNormal, v, l, h, VdotH,\n                    materialInfo.clearcoatF0, materialInfo.clearcoatF90, materialInfo.clearcoatRoughness);\n            #endif\n        }\n\n        // BDTF:\n        #ifdef MATERIAL_TRANSMISSION\n            // If the light ray travels through the geometry, use the point it exits the geometry again.\n            // That will change the angle to the light source, if the material refracts the light ray.\n            vec3 transmissionRay = getVolumeTransmissionRay(n, v, materialInfo.thickness, materialInfo.ior, u_ModelMatrix);\n            pointToLight -= transmissionRay;\n            l = normalize(pointToLight);\n\n            vec3 intensity = getLighIntensity(light, pointToLight);\n            vec3 transmittedLight = intensity * getPunctualRadianceTransmission(n, v, l, materialInfo.alphaRoughness, materialInfo.f0, materialInfo.f90, materialInfo.transmissionFactor, materialInfo.baseColor, materialInfo.ior);\n\n            #ifdef MATERIAL_VOLUME\n                transmittedLight = applyVolumeAttenuation(transmittedLight, length(transmissionRay), materialInfo.attenuationColor, materialInfo.attenuationDistance);\n            #endif\n\n            f_transmission += materialInfo.transmissionFactor * transmittedLight;\n        #endif\n    }\n#endif // !USE_PUNCTUAL\n\n    f_emissive = u_EmissiveFactor;\n#ifdef HAS_EMISSIVE_MAP\n    f_emissive *= texture(u_EmissiveSampler, getEmissiveUV()).rgb;\n#endif\n\n    vec3 color = vec3(0);\n\n    ///\n    /// Layer blending\n    ///\n\n    float clearcoatFactor = 0.0;\n    vec3 clearcoatFresnel = vec3(0.0);\n\n    #ifdef MATERIAL_CLEARCOAT\n        clearcoatFactor = materialInfo.clearcoatFactor;\n        clearcoatFresnel = F_Schlick(materialInfo.clearcoatF0, materialInfo.clearcoatF90, clampedDot(materialInfo.clearcoatNormal, v));\n        // account for masking\n        f_clearcoat = f_clearcoat * clearcoatFactor;\n    #endif\n\n    #ifdef MATERIAL_TRANSMISSION\n        vec3 diffuse = mix(f_diffuse, f_transmission, materialInfo.transmissionFactor);\n    #else\n        vec3 diffuse = f_diffuse;\n    #endif\n\n    color = f_emissive + diffuse + f_specular;\n    color = f_sheen + color * albedoSheenScaling;\n    color = color * (1.0 - clearcoatFactor * clearcoatFresnel) + f_clearcoat;\n\n#ifndef DEBUG_OUTPUT // no debug\n\n#ifdef ALPHAMODE_MASK\n    // Late discard to avaoid samplig artifacts. See https://github.com/KhronosGroup/glTF-Sample-Viewer/issues/267\n    if(baseColor.a < u_AlphaCutoff)\n    {\n        discard;\n    }\n    baseColor.a = 1.0;\n#endif\n\n    // regular shading\n    g_finalColor = vec4(toneMap(color), baseColor.a);\n\n#else // debug output\n\n    #ifdef DEBUG_METALLIC\n        g_finalColor.rgb = vec3(materialInfo.metallic);\n    #endif\n\n    #ifdef DEBUG_ROUGHNESS\n        g_finalColor.rgb = vec3(materialInfo.perceptualRoughness);\n    #endif\n\n    #ifdef DEBUG_NORMAL\n        #ifdef HAS_NORMAL_MAP\n            g_finalColor.rgb = texture(u_NormalSampler, getNormalUV()).rgb;\n        #else\n            g_finalColor.rgb = vec3(0.5, 0.5, 1.0);\n        #endif\n    #endif\n\n    #ifdef DEBUG_GEOMETRY_NORMAL\n        g_finalColor.rgb = (normalInfo.ng + 1.0) / 2.0;\n    #endif\n\n    #ifdef DEBUG_WORLDSPACE_NORMAL\n        g_finalColor.rgb = (n + 1.0) / 2.0;\n    #endif\n\n    #ifdef DEBUG_TANGENT\n        g_finalColor.rgb = t * 0.5 + vec3(0.5);\n    #endif\n\n    #ifdef DEBUG_BITANGENT\n        g_finalColor.rgb = b * 0.5 + vec3(0.5);\n    #endif\n\n    #ifdef DEBUG_BASECOLOR\n        g_finalColor.rgb = linearTosRGB(materialInfo.baseColor);\n    #endif\n\n    #ifdef DEBUG_OCCLUSION\n        g_finalColor.rgb = vec3(ao);\n    #endif\n\n    #ifdef DEBUG_F0\n        g_finalColor.rgb = materialInfo.f0;\n    #endif\n\n    #ifdef DEBUG_FEMISSIVE\n        g_finalColor.rgb = linearTosRGB(f_emissive);\n    #endif\n\n    #ifdef DEBUG_FSPECULAR\n        g_finalColor.rgb = linearTosRGB(f_specular);\n    #endif\n\n    #ifdef DEBUG_FDIFFUSE\n        g_finalColor.rgb = linearTosRGB(f_diffuse);\n    #endif\n\n    #ifdef DEBUG_FCLEARCOAT\n        g_finalColor.rgb = linearTosRGB(f_clearcoat);\n    #endif\n\n    #ifdef DEBUG_FSHEEN\n        g_finalColor.rgb = linearTosRGB(f_sheen);\n    #endif\n\n    #ifdef DEBUG_FTRANSMISSION\n        g_finalColor.rgb = linearTosRGB(f_transmission);\n    #endif\n\n    #ifdef DEBUG_ALPHA\n        g_finalColor.rgb = vec3(baseColor.a);\n    #endif\n\n    g_finalColor.a = 1.0;\n\n#endif // !DEBUG_OUTPUT\n}\n"; // eslint-disable-line

  var brdfShader = "#define GLSLIFY 1\n//\n// Fresnel\n//\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// https://github.com/wdas/brdf/tree/master/src/brdfs\n// https://google.github.io/filament/Filament.md.html\n//\n\n// The following equation models the Fresnel reflectance term of the spec equation (aka F())\n// Implementation of fresnel from [4], Equation 15\nvec3 F_Schlick(vec3 f0, vec3 f90, float VdotH)\n{\n    return f0 + (f90 - f0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);\n}\n\n// Smith Joint GGX\n// Note: Vis = G / (4 * NdotL * NdotV)\n// see Eric Heitz. 2014. Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs. Journal of Computer Graphics Techniques, 3\n// see Real-Time Rendering. Page 331 to 336.\n// see https://google.github.io/filament/Filament.md.html#materialsystem/specularbrdf/geometricshadowing(specularg)\nfloat V_GGX(float NdotL, float NdotV, float alphaRoughness)\n{\n    float alphaRoughnessSq = alphaRoughness * alphaRoughness;\n\n    float GGXV = NdotL * sqrt(NdotV * NdotV * (1.0 - alphaRoughnessSq) + alphaRoughnessSq);\n    float GGXL = NdotV * sqrt(NdotL * NdotL * (1.0 - alphaRoughnessSq) + alphaRoughnessSq);\n\n    float GGX = GGXV + GGXL;\n    if (GGX > 0.0)\n    {\n        return 0.5 / GGX;\n    }\n    return 0.0;\n}\n\n// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())\n// Implementation from \"Average Irregularity Representation of a Roughened Surface for Ray Reflection\" by T. S. Trowbridge, and K. P. Reitz\n// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.\nfloat D_GGX(float NdotH, float alphaRoughness)\n{\n    float alphaRoughnessSq = alphaRoughness * alphaRoughness;\n    float f = (NdotH * NdotH) * (alphaRoughnessSq - 1.0) + 1.0;\n    return alphaRoughnessSq / (M_PI * f * f);\n}\n\nfloat lambdaSheenNumericHelper(float x, float alphaG)\n{\n    float oneMinusAlphaSq = (1.0 - alphaG) * (1.0 - alphaG);\n    float a = mix(21.5473, 25.3245, oneMinusAlphaSq);\n    float b = mix(3.82987, 3.32435, oneMinusAlphaSq);\n    float c = mix(0.19823, 0.16801, oneMinusAlphaSq);\n    float d = mix(-1.97760, -1.27393, oneMinusAlphaSq);\n    float e = mix(-4.32054, -4.85967, oneMinusAlphaSq);\n    return a / (1.0 + b * pow(x, c)) + d * x + e;\n}\n\nfloat lambdaSheen(float cosTheta, float alphaG)\n{\n    if(abs(cosTheta) < 0.5)\n    {\n        return exp(lambdaSheenNumericHelper(cosTheta, alphaG));\n    }\n    else\n    {\n        return exp(2.0 * lambdaSheenNumericHelper(0.5, alphaG) - lambdaSheenNumericHelper(1.0 - cosTheta, alphaG));\n    }\n}\n\nfloat V_Sheen(float NdotL, float NdotV, float sheenRoughness)\n{\n    sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]\n    float alphaG = sheenRoughness * sheenRoughness;\n\n    return clamp(1.0 / ((1.0 + lambdaSheen(NdotV, alphaG) + lambdaSheen(NdotL, alphaG)) *\n        (4.0 * NdotV * NdotL)), 0.0, 1.0);\n}\n\n//Sheen implementation-------------------------------------------------------------------------------------\n// See  https://github.com/sebavan/glTF/tree/KHR_materials_sheen/extensions/2.0/Khronos/KHR_materials_sheen\n\n// Estevez and Kulla http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf\nfloat D_Charlie(float sheenRoughness, float NdotH)\n{\n    sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]\n    float alphaG = sheenRoughness * sheenRoughness;\n    float invR = 1.0 / alphaG;\n    float cos2h = NdotH * NdotH;\n    float sin2h = 1.0 - cos2h;\n    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * M_PI);\n}\n\n//https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB\nvec3 BRDF_lambertian(vec3 f0, vec3 f90, vec3 diffuseColor, float VdotH)\n{\n    // see https://seblagarde.wordpress.com/2012/01/08/pi-or-not-to-pi-in-game-lighting-equation/\n    return (1.0 - F_Schlick(f0, f90, VdotH)) * (diffuseColor / M_PI);\n}\n\n//  https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB\nvec3 BRDF_specularGGX(vec3 f0, vec3 f90, float alphaRoughness, float VdotH, float NdotL, float NdotV, float NdotH)\n{\n    vec3 F = F_Schlick(f0, f90, VdotH);\n    float Vis = V_GGX(NdotL, NdotV, alphaRoughness);\n    float D = D_GGX(NdotH, alphaRoughness);\n\n    return F * Vis * D;\n}\n\n// f_sheen\nvec3 BRDF_specularSheen(vec3 sheenColor, float sheenRoughness, float NdotL, float NdotV, float NdotH)\n{\n    float sheenDistribution = D_Charlie(sheenRoughness, NdotH);\n    float sheenVisibility = V_Sheen(NdotL, NdotV, sheenRoughness);\n    return sheenColor * sheenDistribution * sheenVisibility;\n}\n"; // eslint-disable-line

  var iblShader = "#define GLSLIFY 1\nvec3 getDiffuseLight(vec3 n)\n{\n    return texture(u_LambertianEnvSampler, u_envRotation * n).rgb;\n}\n\nvec4 getSpecularSample(vec3 reflection, float lod)\n{\n    return textureLod(u_GGXEnvSampler, u_envRotation * reflection, lod);\n}\n\nvec4 getSheenSample(vec3 reflection, float lod)\n{\n    return textureLod(u_CharlieEnvSampler, u_envRotation * reflection, lod);\n}\n\nvec3 getIBLRadianceGGX(vec3 n, vec3 v, float roughness, vec3 F0)\n{\n    float NdotV = clampedDot(n, v);\n    float lod = roughness * float(u_MipCount - 1);\n    vec3 reflection = normalize(reflect(-v, n));\n\n    vec2 brdfSamplePoint = clamp(vec2(NdotV, roughness), vec2(0.0, 0.0), vec2(1.0, 1.0));\n    vec2 f_ab = texture(u_GGXLUT, brdfSamplePoint).rg;\n    vec4 specularSample = getSpecularSample(reflection, lod);\n\n    vec3 specularLight = specularSample.rgb;\n\n    // see https://bruop.github.io/ibl/#single_scattering_results at Single Scattering Results\n    // Roughness dependent fresnel, from Fdez-Aguera\n    vec3 Fr = max(vec3(1.0 - roughness), F0) - F0;\n    vec3 k_S = F0 + Fr * pow(1.0 - NdotV, 5.0);\n    vec3 FssEss = k_S * f_ab.x + f_ab.y;\n\n    return specularLight * FssEss;\n}\n\nvec3 getTransmissionSample(vec2 fragCoord, float roughness, float ior)\n{\n    float framebufferLod = log2(float(u_TransmissionFramebufferSize.x)) * applyIorToRoughness(roughness, ior);\n    vec3 transmittedLight = textureLod(u_TransmissionFramebufferSampler, fragCoord.xy, framebufferLod).rgb;\n    transmittedLight = sRGBToLinear(transmittedLight);\n    return transmittedLight;\n}\n\nvec3 getIBLVolumeRefraction(vec3 n, vec3 v, float perceptualRoughness, vec3 baseColor, vec3 f0, vec3 f90,\n    vec3 position, mat4 modelMatrix, mat4 viewMatrix, mat4 projMatrix, float ior, float thickness, vec3 attenuationColor, float attenuationDistance)\n{\n    vec3 transmissionRay = getVolumeTransmissionRay(n, v, thickness, ior, modelMatrix);\n    vec3 refractedRayExit = position + transmissionRay;\n\n    // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.\n    vec4 ndcPos = projMatrix * viewMatrix * vec4(refractedRayExit, 1.0);\n    vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n    refractionCoords += 1.0;\n    refractionCoords /= 2.0;\n\n    // Sample framebuffer to get pixel the refracted ray hits.\n    vec3 transmittedLight = getTransmissionSample(refractionCoords, perceptualRoughness, ior);\n\n    vec3 attenuatedColor = applyVolumeAttenuation(transmittedLight, length(transmissionRay), attenuationColor, attenuationDistance);\n\n    // Sample GGX LUT to get the specular component.\n    float NdotV = clampedDot(n, v);\n    vec2 brdfSamplePoint = clamp(vec2(NdotV, perceptualRoughness), vec2(0.0, 0.0), vec2(1.0, 1.0));\n    vec2 brdf = texture(u_GGXLUT, brdfSamplePoint).rg;   \n    vec3 specularColor = f0 * brdf.x + f90 * brdf.y;\n\n    return (1.0 - specularColor) * attenuatedColor * baseColor;\n}\n\nvec3 getIBLRadianceLambertian(vec3 n, vec3 v, float roughness, vec3 diffuseColor, vec3 F0)\n{\n    float NdotV = clampedDot(n, v);\n    vec2 brdfSamplePoint = clamp(vec2(NdotV, roughness), vec2(0.0, 0.0), vec2(1.0, 1.0));\n    vec2 f_ab = texture(u_GGXLUT, brdfSamplePoint).rg;\n\n    vec3 diffuseLight = getDiffuseLight(n);\n\n    // see https://bruop.github.io/ibl/#single_scattering_results at Single Scattering Results\n    // Roughness dependent fresnel, from Fdez-Aguera\n    vec3 Fr = max(vec3(1.0 - roughness), F0) - F0;\n    vec3 k_S = F0 + Fr * pow(1.0 - NdotV, 5.0);\n    vec3 FssEss = k_S * f_ab.x + f_ab.y;\n\n    // Multiple scattering, from Fdez-Aguera\n    float Ems = (1.0 - (f_ab.x + f_ab.y));\n    vec3 F_avg = F0 + (1.0 - F0) / 21.0;\n    vec3 FmsEms = Ems * FssEss * F_avg / (1.0 - F_avg * Ems);\n    vec3 k_D = diffuseColor * (1.0 - FssEss - FmsEms);\n\n    return (FmsEms + k_D) * diffuseLight ;\n}\n\nvec3 getIBLRadianceCharlie(vec3 n, vec3 v, float sheenRoughness, vec3 sheenColor)\n{\n    float NdotV = clampedDot(n, v);\n    float lod = sheenRoughness * float(u_MipCount - 1);\n    vec3 reflection = normalize(reflect(-v, n));\n\n    vec2 brdfSamplePoint = clamp(vec2(NdotV, sheenRoughness), vec2(0.0, 0.0), vec2(1.0, 1.0));\n    float brdf = texture(u_CharlieLUT, brdfSamplePoint).b;\n    vec4 sheenSample = getSheenSample(reflection, lod);\n\n    vec3 sheenLight = sheenSample.rgb;\n    return sheenLight * sheenColor * brdf;\n}\n"; // eslint-disable-line

  var punctualShader = "#define GLSLIFY 1\n// KHR_lights_punctual extension.\n// see https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual\nstruct Light\n{\n    vec3 direction;\n    float range;\n\n    vec3 color;\n    float intensity;\n\n    vec3 position;\n    float innerConeCos;\n\n    float outerConeCos;\n    int type;\n    float padding1;\n    float padding2;\n};\n\nconst int LightType_Directional = 0;\nconst int LightType_Point = 1;\nconst int LightType_Spot = 2;\n\n// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#range-property\nfloat getRangeAttenuation(float range, float distance)\n{\n    if (range <= 0.0)\n    {\n        // negative range means unlimited\n        return 1.0 / pow(distance, 2.0);\n    }\n    return max(min(1.0 - pow(distance / range, 4.0), 1.0), 0.0) / pow(distance, 2.0);\n}\n\n// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#inner-and-outer-cone-angles\nfloat getSpotAttenuation(vec3 pointToLight, vec3 spotDirection, float outerConeCos, float innerConeCos)\n{\n    float actualCos = dot(normalize(spotDirection), normalize(-pointToLight));\n    if (actualCos > outerConeCos)\n    {\n        if (actualCos < innerConeCos)\n        {\n            return smoothstep(outerConeCos, innerConeCos, actualCos);\n        }\n        return 1.0;\n    }\n    return 0.0;\n}\n\nvec3 getLighIntensity(Light light, vec3 pointToLight)\n{\n    float rangeAttenuation = 1.0;\n    float spotAttenuation = 1.0;\n\n    if (light.type != LightType_Directional)\n    {\n        rangeAttenuation = getRangeAttenuation(light.range, length(pointToLight));\n    }\n    if (light.type == LightType_Spot)\n    {\n        spotAttenuation = getSpotAttenuation(pointToLight, light.direction, light.outerConeCos, light.innerConeCos);\n    }\n\n    return rangeAttenuation * spotAttenuation * light.intensity * light.color;\n}\n\nvec3 getPunctualRadianceTransmission(vec3 normal, vec3 view, vec3 pointToLight, float alphaRoughness,\n        vec3 f0, vec3 f90, float transmissionPercentage, vec3 baseColor, float ior)\n{\n    float transmissionRougness = applyIorToRoughness(alphaRoughness, ior);\n\n    vec3 n = normalize(normal);           // Outward direction of surface point\n    vec3 v = normalize(view);             // Direction from surface point to view\n    vec3 l = normalize(pointToLight);\n    vec3 l_mirror = normalize(l + 2.0*n*dot(-l, n));     // Mirror light reflection vector on surface\n    vec3 h = normalize(l_mirror + v);            // Halfway vector between transmission light vector and v\n\n    float D = D_GGX(clamp(dot(n, h), 0.0, 1.0), transmissionRougness);\n    vec3 F = F_Schlick(f0, f90, clamp(dot(v, h), 0.0, 1.0));\n    float T = transmissionPercentage;\n    float Vis = V_GGX(clamp(dot(n, l_mirror), 0.0, 1.0), clamp(dot(n, v), 0.0, 1.0), transmissionRougness);\n\n    // Transmission BTDF\n    return (1.0 - F) * baseColor * D * Vis;\n}\n\nvec3 getPunctualRadianceClearCoat(vec3 clearcoatNormal, vec3 v, vec3 l, vec3 h, float VdotH, vec3 f0, vec3 f90, float clearcoatRoughness)\n{\n    float NdotL = clampedDot(clearcoatNormal, l);\n    float NdotV = clampedDot(clearcoatNormal, v);\n    float NdotH = clampedDot(clearcoatNormal, h);\n    return NdotL * BRDF_specularGGX(f0, f90, clearcoatRoughness * clearcoatRoughness, VdotH, NdotL, NdotV, NdotH);\n}\n\nvec3 getPunctualRadianceSheen(vec3 sheenColor, float sheenRoughness, float NdotL, float NdotV, float NdotH)\n{\n    return NdotL * BRDF_specularSheen(sheenColor, sheenRoughness, NdotL, NdotV, NdotH);\n}\n\n// Compute attenuated light as it travels through a volume.\nvec3 applyVolumeAttenuation(vec3 radiance, float transmissionDistance, vec3 attenuationColor, float attenuationDistance)\n{\n    if (attenuationDistance == 0.0)\n    {\n        // Attenuation distance is +∞ (which we indicate by zero), i.e. the transmitted color is not attenuated at all.\n        return radiance;\n    }\n    else\n    {\n        // Compute light attenuation using Beer's law.\n        vec3 attenuationCoefficient = -log(attenuationColor) / attenuationDistance;\n        vec3 transmittance = exp(-attenuationCoefficient * transmissionDistance); // Beer's law\n        return transmittance * radiance;\n    }\n}\n\nvec3 getVolumeTransmissionRay(vec3 n, vec3 v, float thickness, float ior, mat4 modelMatrix)\n{\n    // Direction of refracted light.\n    vec3 refractionVector = refract(-v, normalize(n), 1.0 / ior);\n\n    // Compute rotation-independant scaling of the model matrix.\n    vec3 modelScale;\n    modelScale.x = length(vec3(modelMatrix[0].xyz));\n    modelScale.y = length(vec3(modelMatrix[1].xyz));\n    modelScale.z = length(vec3(modelMatrix[2].xyz));\n\n    // The thickness is specified in local space.\n    return normalize(refractionVector) * thickness * modelScale;\n}\n"; // eslint-disable-line

  var primitiveShader = "#define GLSLIFY 1\n#include <animation.glsl>\n\nin vec3 a_Position;\nout vec3 v_Position;\n\n#ifdef HAS_NORMALS\nin vec3 a_Normal;\n#endif\n\n#ifdef HAS_TANGENTS\nin vec4 a_Tangent;\n#endif\n\n#ifdef HAS_NORMALS\n#ifdef HAS_TANGENTS\nout mat3 v_TBN;\n#else\nout vec3 v_Normal;\n#endif\n#endif\n\n#ifdef HAS_UV_SET1\nin vec2 a_UV1;\n#endif\n\n#ifdef HAS_UV_SET2\nin vec2 a_UV2;\n#endif\n\nout vec2 v_UVCoord1;\nout vec2 v_UVCoord2;\n\n#ifdef HAS_VERTEX_COLOR_VEC3\nin vec3 a_Color;\nout vec3 v_Color;\n#endif\n\n#ifdef HAS_VERTEX_COLOR_VEC4\nin vec4 a_Color;\nout vec4 v_Color;\n#endif\n\nuniform mat4 u_ViewProjectionMatrix;\nuniform mat4 u_ModelMatrix;\nuniform mat4 u_NormalMatrix;\n\nvec4 getPosition()\n{\n    vec4 pos = vec4(a_Position, 1.0);\n\n#ifdef USE_MORPHING\n    pos += getTargetPosition();\n#endif\n\n#ifdef USE_SKINNING\n    pos = getSkinningMatrix() * pos;\n#endif\n\n    return pos;\n}\n\n#ifdef HAS_NORMALS\nvec3 getNormal()\n{\n    vec3 normal = a_Normal;\n\n#ifdef USE_MORPHING\n    normal += getTargetNormal();\n#endif\n\n#ifdef USE_SKINNING\n    normal = mat3(getSkinningNormalMatrix()) * normal;\n#endif\n\n    return normalize(normal);\n}\n#endif\n\n#ifdef HAS_TANGENTS\nvec3 getTangent()\n{\n    vec3 tangent = a_Tangent.xyz;\n\n#ifdef USE_MORPHING\n    tangent += getTargetTangent();\n#endif\n\n#ifdef USE_SKINNING\n    tangent = mat3(getSkinningMatrix()) * tangent;\n#endif\n\n    return normalize(tangent);\n}\n#endif\n\nvoid main()\n{\n    vec4 pos = u_ModelMatrix * getPosition();\n    v_Position = vec3(pos.xyz) / pos.w;\n\n    #ifdef HAS_NORMALS\n    #ifdef HAS_TANGENTS\n        vec3 tangent = getTangent();\n        vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(getNormal(), 0.0)));\n        vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(tangent, 0.0)));\n        vec3 bitangentW = cross(normalW, tangentW) * a_Tangent.w;\n        v_TBN = mat3(tangentW, bitangentW, normalW);\n    #else // !HAS_TANGENTS\n        v_Normal = normalize(vec3(u_NormalMatrix * vec4(getNormal(), 0.0)));\n    #endif\n    #endif // !HAS_NORMALS\n\n    v_UVCoord1 = vec2(0.0, 0.0);\n    v_UVCoord2 = vec2(0.0, 0.0);\n\n    #ifdef HAS_UV_SET1\n        v_UVCoord1 = a_UV1;\n    #endif\n\n    #ifdef HAS_UV_SET2\n        v_UVCoord2 = a_UV2;\n    #endif\n\n    #if defined(HAS_VERTEX_COLOR_VEC3) || defined(HAS_VERTEX_COLOR_VEC4)\n        v_Color = a_Color;\n    #endif\n\n    gl_Position = u_ViewProjectionMatrix * pos;\n}\n"; // eslint-disable-line

  var texturesShader = "#define GLSLIFY 1\nin vec2 v_UVCoord1;\nin vec2 v_UVCoord2;\n\n// IBL\nuniform int u_MipCount;\nuniform samplerCube u_LambertianEnvSampler;\nuniform samplerCube u_GGXEnvSampler;\nuniform sampler2D u_GGXLUT;\nuniform samplerCube u_CharlieEnvSampler;\nuniform sampler2D u_CharlieLUT;\nuniform sampler2D u_SheenELUT;\nuniform mat3 u_envRotation;\n\n// General Material\nuniform sampler2D u_NormalSampler;\nuniform float u_NormalScale;\nuniform int u_NormalUVSet;\nuniform mat3 u_NormalUVTransform;\n\nuniform vec3 u_EmissiveFactor;\nuniform sampler2D u_EmissiveSampler;\nuniform int u_EmissiveUVSet;\nuniform mat3 u_EmissiveUVTransform;\n\nuniform sampler2D u_OcclusionSampler;\nuniform int u_OcclusionUVSet;\nuniform float u_OcclusionStrength;\nuniform mat3 u_OcclusionUVTransform;\n\n// Metallic Roughness Material\nuniform sampler2D u_BaseColorSampler;\nuniform int u_BaseColorUVSet;\nuniform mat3 u_BaseColorUVTransform;\n\nuniform sampler2D u_MetallicRoughnessSampler;\nuniform int u_MetallicRoughnessUVSet;\nuniform mat3 u_MetallicRoughnessUVTransform;\n\n// Specular Glossiness Material\nuniform sampler2D u_DiffuseSampler;\nuniform int u_DiffuseUVSet;\nuniform mat3 u_DiffuseUVTransform;\n\nuniform sampler2D u_SpecularGlossinessSampler;\nuniform int u_SpecularGlossinessUVSet;\nuniform mat3 u_SpecularGlossinessUVTransform;\n\n// Clearcoat Material\nuniform sampler2D u_ClearcoatSampler;\nuniform int u_ClearcoatUVSet;\nuniform mat3 u_ClearcoatUVTransform;\n\nuniform sampler2D u_ClearcoatRoughnessSampler;\nuniform int u_ClearcoatRoughnessUVSet;\nuniform mat3 u_ClearcoatRoughnessUVTransform;\n\nuniform sampler2D u_ClearcoatNormalSampler;\nuniform int u_ClearcoatNormalUVSet;\nuniform mat3 u_ClearcoatNormalUVTransform;\nuniform float u_ClearcoatNormalScale;\n\n// Sheen Material\nuniform sampler2D u_SheenColorSampler;\nuniform int u_SheenColorUVSet;\nuniform mat3 u_SheenColorUVTransform;\nuniform sampler2D u_SheenRoughnessSampler;\nuniform int u_SheenRoughnessUVSet;\nuniform mat3 u_SheenRoughnessUVTransform;\n\n// Specular Material\nuniform sampler2D u_SpecularSampler;\nuniform int u_SpecularUVSet;\nuniform mat3 u_SpecularUVTransform;\nuniform sampler2D u_SpecularColorSampler;\nuniform int u_SpecularColorUVSet;\nuniform mat3 u_SpecularColorUVTransform;\n\n// Transmission Material\nuniform sampler2D u_TransmissionSampler;\nuniform int u_TransmissionUVSet;\nuniform mat3 u_TransmissionUVTransform;\nuniform sampler2D u_TransmissionFramebufferSampler;\nuniform ivec2 u_TransmissionFramebufferSize;\n\n// Volume Material\nuniform sampler2D u_ThicknessSampler;\nuniform int u_ThicknessUVSet;\nuniform mat3 u_ThicknessUVTransform;\n\nvec2 getNormalUV()\n{\n    vec3 uv = vec3(u_NormalUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_NORMAL_UV_TRANSFORM\n    uv *= u_NormalUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getEmissiveUV()\n{\n    vec3 uv = vec3(u_EmissiveUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_EMISSIVE_UV_TRANSFORM\n    uv *= u_EmissiveUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getOcclusionUV()\n{\n    vec3 uv = vec3(u_OcclusionUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_OCCLUSION_UV_TRANSFORM\n    uv *= u_OcclusionUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getBaseColorUV()\n{\n    vec3 uv = vec3(u_BaseColorUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_BASECOLOR_UV_TRANSFORM\n    uv *= u_BaseColorUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getMetallicRoughnessUV()\n{\n    vec3 uv = vec3(u_MetallicRoughnessUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_METALLICROUGHNESS_UV_TRANSFORM\n    uv *= u_MetallicRoughnessUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getSpecularGlossinessUV()\n{\n    vec3 uv = vec3(u_SpecularGlossinessUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_SPECULARGLOSSINESS_UV_TRANSFORM\n    uv *= u_SpecularGlossinessUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getDiffuseUV()\n{\n    vec3 uv = vec3(u_DiffuseUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n\n    #ifdef HAS_DIFFUSE_UV_TRANSFORM\n    uv *= u_DiffuseUVTransform;\n    #endif\n\n    return uv.xy;\n}\n\nvec2 getClearcoatUV()\n{\n    vec3 uv = vec3(u_ClearcoatUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_CLEARCOAT_UV_TRANSFORM\n    uv *= u_ClearcoatUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getClearcoatRoughnessUV()\n{\n    vec3 uv = vec3(u_ClearcoatRoughnessUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_CLEARCOATROUGHNESS_UV_TRANSFORM\n    uv *= u_ClearcoatRoughnessUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getClearcoatNormalUV()\n{\n    vec3 uv = vec3(u_ClearcoatNormalUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_CLEARCOATNORMAL_UV_TRANSFORM\n    uv *= u_ClearcoatNormalUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getSheenColorUV()\n{\n    vec3 uv = vec3(u_SheenColorUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_SHEENCOLOR_UV_TRANSFORM\n    uv *= u_SheenColorUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getSheenRoughnessUV()\n{\n    vec3 uv = vec3(u_SheenRoughnessUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_SHEENROUGHNESS_UV_TRANSFORM\n    uv *= u_SheenRoughnessUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getTransmissionUV()\n{\n    vec3 uv = vec3(u_TransmissionUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_TRANSMISSION_UV_TRANSFORM\n    uv *= u_TransmissionUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getSpecularUV()\n{\n    vec3 uv = vec3(u_SpecularUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_SPECULAR_UV_TRANSFORM\n    uv *= u_SpecularUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getSpecularColorUV()\n{\n    vec3 uv = vec3(u_SpecularColorUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_SPECULARCOLOR_UV_TRANSFORM\n    uv *= u_SpecularColorUVTransform;\n    #endif\n    return uv.xy;\n}\n\nvec2 getThicknessUV()\n{\n    vec3 uv = vec3(u_ThicknessUVSet < 1 ? v_UVCoord1 : v_UVCoord2, 1.0);\n    #ifdef HAS_THICKNESS_UV_TRANSFORM\n    uv *= u_ThicknessUVTransform;\n    #endif\n    return uv.xy;\n}\n"; // eslint-disable-line

  var tonemappingShader = "#define GLSLIFY 1\nuniform float u_Exposure;\n\nconst float GAMMA = 2.2;\nconst float INV_GAMMA = 1.0 / GAMMA;\n\n// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT\nconst mat3 ACESInputMat = mat3\n(\n    0.59719, 0.07600, 0.02840,\n    0.35458, 0.90834, 0.13383,\n    0.04823, 0.01566, 0.83777\n);\n\n// ODT_SAT => XYZ => D60_2_D65 => sRGB\nconst mat3 ACESOutputMat = mat3\n(\n    1.60475, -0.10208, -0.00327,\n    -0.53108,  1.10813, -0.07276,\n    -0.07367, -0.00605,  1.07602\n);\n\n// linear to sRGB approximation\n// see http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html\nvec3 linearTosRGB(vec3 color)\n{\n    return pow(color, vec3(INV_GAMMA));\n}\n\n// sRGB to linear approximation\n// see http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html\nvec3 sRGBToLinear(vec3 srgbIn)\n{\n    return vec3(pow(srgbIn.xyz, vec3(GAMMA)));\n}\n\nvec4 sRGBToLinear(vec4 srgbIn)\n{\n    return vec4(sRGBToLinear(srgbIn.xyz), srgbIn.w);\n}\n\n// ACES tone map (faster approximation)\n// see: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/\nvec3 toneMapACES_Narkowicz(vec3 color)\n{\n    const float A = 2.51;\n    const float B = 0.03;\n    const float C = 2.43;\n    const float D = 0.59;\n    const float E = 0.14;\n    return clamp((color * (A * color + B)) / (color * (C * color + D) + E), 0.0, 1.0);\n}\n\n// ACES filmic tone map approximation\n// see https://github.com/TheRealMJP/BakingLab/blob/master/BakingLab/ACES.hlsl\nvec3 RRTAndODTFit(vec3 color)\n{\n    vec3 a = color * (color + 0.0245786) - 0.000090537;\n    vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;\n    return a / b;\n}\n// tone mapping \nvec3 toneMapACES_Hill(vec3 color)\n{\n    color = ACESInputMat * color;\n\n    // Apply RRT and ODT\n    color = RRTAndODTFit(color);\n\n    color = ACESOutputMat * color;\n\n    // Clamp to [0, 1]\n    color = clamp(color, 0.0, 1.0);\n\n    return color;\n}\n\nvec3 toneMap(vec3 color)\n{\n    color *= u_Exposure;\n\n#ifdef TONEMAP_ACES_NARKOWICZ\n    color = toneMapACES_Narkowicz(color);\n#endif\n\n#ifdef TONEMAP_ACES_HILL\n    color = toneMapACES_Hill(color);\n#endif\n\n#ifdef TONEMAP_ACES_3D_COMMERCE\n    // boost exposure as discussed in https://github.com/mrdoob/three.js/pull/19621\n    // this factor is based on the exposure correction of Krzysztof Narkowicz in his\n    // implemetation of ACES tone mapping\n    color /= 0.6;\n\n    color = toneMapACES_Hill(color);\n#endif\n\n    return linearTosRGB(color);\n}\n"; // eslint-disable-line

  var shaderFunctions = "#define GLSLIFY 1\n// textures.glsl needs to be included\n\nconst float M_PI = 3.141592653589793;\n\nin vec3 v_Position;\n\n#ifdef HAS_NORMALS\n#ifdef HAS_TANGENTS\nin mat3 v_TBN;\n#else\nin vec3 v_Normal;\n#endif\n#endif\n\n#ifdef HAS_VERTEX_COLOR_VEC3\nin vec3 v_Color;\n#endif\n#ifdef HAS_VERTEX_COLOR_VEC4\nin vec4 v_Color;\n#endif\n\nvec4 getVertexColor()\n{\n   vec4 color = vec4(1.0, 1.0, 1.0, 1.0);\n\n#ifdef HAS_VERTEX_COLOR_VEC3\n    color.rgb = v_Color.rgb;\n#endif\n#ifdef HAS_VERTEX_COLOR_VEC4\n    color = v_Color;\n#endif\n\n   return color;\n}\n\nstruct NormalInfo {\n    vec3 ng;   // Geometric normal\n    vec3 n;    // Pertubed normal\n    vec3 t;    // Pertubed tangent\n    vec3 b;    // Pertubed bitangent\n};\n\nfloat clampedDot(vec3 x, vec3 y)\n{\n    return clamp(dot(x, y), 0.0, 1.0);\n}\n\nfloat max3(vec3 v)\n{\n    return max(max(v.x, v.y), v.z);\n}\n\nfloat applyIorToRoughness(float roughness, float ior)\n{\n    // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and\n    // an IOR of 1.5 results in the default amount of microfacet refraction.\n    return roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);\n}\n"; // eslint-disable-line

  var animationShader = "#define GLSLIFY 1\n#ifdef HAS_TARGET_POSITION0\nin vec3 a_Target_Position0;\n#endif\n\n#ifdef HAS_TARGET_POSITION1\nin vec3 a_Target_Position1;\n#endif\n\n#ifdef HAS_TARGET_POSITION2\nin vec3 a_Target_Position2;\n#endif\n\n#ifdef HAS_TARGET_POSITION3\nin vec3 a_Target_Position3;\n#endif\n\n#ifdef HAS_TARGET_POSITION4\nin vec3 a_Target_Position4;\n#endif\n\n#ifdef HAS_TARGET_POSITION5\nin vec3 a_Target_Position5;\n#endif\n\n#ifdef HAS_TARGET_POSITION6\nin vec3 a_Target_Position6;\n#endif\n\n#ifdef HAS_TARGET_POSITION7\nin vec3 a_Target_Position7;\n#endif\n\n#ifdef HAS_TARGET_NORMAL0\nin vec3 a_Target_Normal0;\n#endif\n\n#ifdef HAS_TARGET_NORMAL1\nin vec3 a_Target_Normal1;\n#endif\n\n#ifdef HAS_TARGET_NORMAL2\nin vec3 a_Target_Normal2;\n#endif\n\n#ifdef HAS_TARGET_NORMAL3\nin vec3 a_Target_Normal3;\n#endif\n\n#ifdef HAS_TARGET_TANGENT0\nin vec3 a_Target_Tangent0;\n#endif\n\n#ifdef HAS_TARGET_TANGENT1\nin vec3 a_Target_Tangent1;\n#endif\n\n#ifdef HAS_TARGET_TANGENT2\nin vec3 a_Target_Tangent2;\n#endif\n\n#ifdef HAS_TARGET_TANGENT3\nin vec3 a_Target_Tangent3;\n#endif\n\n#ifdef USE_MORPHING\nuniform float u_morphWeights[WEIGHT_COUNT];\n#endif\n\n#ifdef HAS_JOINT_SET1\nin vec4 a_Joint1;\n#endif\n\n#ifdef HAS_JOINT_SET2\nin vec4 a_Joint2;\n#endif\n\n#ifdef HAS_WEIGHT_SET1\nin vec4 a_Weight1;\n#endif\n\n#ifdef HAS_WEIGHT_SET2\nin vec4 a_Weight2;\n#endif\n\n#ifdef USE_SKINNING\nuniform mat4 u_jointMatrix[JOINT_COUNT];\nuniform mat4 u_jointNormalMatrix[JOINT_COUNT];\n#endif\n\n#ifdef USE_SKINNING\nmat4 getSkinningMatrix()\n{\n    mat4 skin = mat4(0);\n\n    #if defined(HAS_WEIGHT_SET1) && defined(HAS_JOINT_SET1)\n    skin +=\n        a_Weight1.x * u_jointMatrix[int(a_Joint1.x)] +\n        a_Weight1.y * u_jointMatrix[int(a_Joint1.y)] +\n        a_Weight1.z * u_jointMatrix[int(a_Joint1.z)] +\n        a_Weight1.w * u_jointMatrix[int(a_Joint1.w)];\n    #endif\n\n    #if defined(HAS_WEIGHT_SET2) && defined(HAS_JOINT_SET2)\n    skin +=\n        a_Weight2.x * u_jointMatrix[int(a_Joint2.x)] +\n        a_Weight2.y * u_jointMatrix[int(a_Joint2.y)] +\n        a_Weight2.z * u_jointMatrix[int(a_Joint2.z)] +\n        a_Weight2.w * u_jointMatrix[int(a_Joint2.w)];\n    #endif\n\n    return skin;\n}\n\nmat4 getSkinningNormalMatrix()\n{\n    mat4 skin = mat4(0);\n\n    #if defined(HAS_WEIGHT_SET1) && defined(HAS_JOINT_SET1)\n    skin +=\n        a_Weight1.x * u_jointNormalMatrix[int(a_Joint1.x)] +\n        a_Weight1.y * u_jointNormalMatrix[int(a_Joint1.y)] +\n        a_Weight1.z * u_jointNormalMatrix[int(a_Joint1.z)] +\n        a_Weight1.w * u_jointNormalMatrix[int(a_Joint1.w)];\n    #endif\n\n    #if defined(HAS_WEIGHT_SET2) && defined(HAS_JOINT_SET2)\n    skin +=\n        a_Weight2.x * u_jointNormalMatrix[int(a_Joint2.x)] +\n        a_Weight2.y * u_jointNormalMatrix[int(a_Joint2.y)] +\n        a_Weight2.z * u_jointNormalMatrix[int(a_Joint2.z)] +\n        a_Weight2.w * u_jointNormalMatrix[int(a_Joint2.w)];\n    #endif\n\n    return skin;\n}\n#endif // !USE_SKINNING\n\n#ifdef USE_MORPHING\nvec4 getTargetPosition()\n{\n    vec4 pos = vec4(0);\n\n#ifdef HAS_TARGET_POSITION0\n    pos.xyz += u_morphWeights[0] * a_Target_Position0;\n#endif\n\n#ifdef HAS_TARGET_POSITION1\n    pos.xyz += u_morphWeights[1] * a_Target_Position1;\n#endif\n\n#ifdef HAS_TARGET_POSITION2\n    pos.xyz += u_morphWeights[2] * a_Target_Position2;\n#endif\n\n#ifdef HAS_TARGET_POSITION3\n    pos.xyz += u_morphWeights[3] * a_Target_Position3;\n#endif\n\n#ifdef HAS_TARGET_POSITION4\n    pos.xyz += u_morphWeights[4] * a_Target_Position4;\n#endif\n\n    return pos;\n}\n\nvec3 getTargetNormal()\n{\n    vec3 normal = vec3(0);\n\n#ifdef HAS_TARGET_NORMAL0\n    normal += u_morphWeights[0] * a_Target_Normal0;\n#endif\n\n#ifdef HAS_TARGET_NORMAL1\n    normal += u_morphWeights[1] * a_Target_Normal1;\n#endif\n\n#ifdef HAS_TARGET_NORMAL2\n    normal += u_morphWeights[2] * a_Target_Normal2;\n#endif\n\n#ifdef HAS_TARGET_NORMAL3\n    normal += u_morphWeights[3] * a_Target_Normal3;\n#endif\n\n#ifdef HAS_TARGET_NORMAL4\n    normal += u_morphWeights[4] * a_Target_Normal4;\n#endif\n\n    return normal;\n}\n\nvec3 getTargetTangent()\n{\n    vec3 tangent = vec3(0);\n\n#ifdef HAS_TARGET_TANGENT0\n    tangent += u_morphWeights[0] * a_Target_Tangent0;\n#endif\n\n#ifdef HAS_TARGET_TANGENT1\n    tangent += u_morphWeights[1] * a_Target_Tangent1;\n#endif\n\n#ifdef HAS_TARGET_TANGENT2\n    tangent += u_morphWeights[2] * a_Target_Tangent2;\n#endif\n\n#ifdef HAS_TARGET_TANGENT3\n    tangent += u_morphWeights[3] * a_Target_Tangent3;\n#endif\n\n#ifdef HAS_TARGET_TANGENT4\n    tangent += u_morphWeights[4] * a_Target_Tangent4;\n#endif\n\n    return tangent;\n}\n\n#endif // !USE_MORPHING\n"; // eslint-disable-line

  var cubemapVertShader = "#define GLSLIFY 1\nin vec3 a_position;\nout vec3 TexCoords;\n\nuniform mat4 u_ViewProjectionMatrix;\nuniform mat3 u_envRotation;\n\nvoid main()\n{\n    TexCoords = u_envRotation * a_position;\n    mat4 mat = u_ViewProjectionMatrix;\n    mat[3] = vec4(0.0, 0.0, 0.0, 0.1);\n    vec4 pos = mat * vec4(a_position, 1.0);\n    gl_Position = pos.xyww;\n}\n"; // eslint-disable-line

  var cubemapFragShader = "precision highp float;\n#define GLSLIFY 1\n\n#include <tonemapping.glsl>\n\nuniform samplerCube u_specularEnvSampler;\nuniform float u_envBlurNormalized;\nuniform int u_MipCount;\n\nout vec4 FragColor;\nin vec3 TexCoords;\n\nvoid main()\n{\n    vec4 color = textureLod(u_specularEnvSampler, TexCoords, u_envBlurNormalized * float(u_MipCount - 1));\n    FragColor = vec4(toneMap(color.rgb), color.a);\n}\n"; // eslint-disable-line

  class gltfLight extends GltfObject
  {
      constructor(
          type = "directional",
          color = [1, 1, 1],
          intensity = 1,
          innerConeAngle = 0,
          outerConeAngle = Math.PI / 4,
          range = -1,
          name = undefined,
          node = undefined)
      {
          super();
          this.type = type;
          this.color = color;
          this.intensity = intensity;
          this.innerConeAngle = innerConeAngle;
          this.outerConeAngle = outerConeAngle;
          this.range = range;
          this.name = name;
          // non gltf
          this.node = node;
          //Can be used to overwrite direction from node
          this.direction = undefined;
      }

      initGl(gltf, webGlContext)
      {
          super.initGl(gltf, webGlContext);

          for (let i = 0; i < gltf.nodes.length; i++)
          {
              const nodeExtensions = gltf.nodes[i].extensions;
              if (nodeExtensions === undefined)
              {
                  continue;
              }

              const lightsExtension = nodeExtensions.KHR_lights_punctual;
              if (lightsExtension === undefined)
              {
                  continue;
              }

              const lightIndex = lightsExtension.light;
              if (gltf.lights[lightIndex] === this)
              {
                  this.node = i;
                  break;
              }
          }
      }

      fromJson(jsonLight)
      {
          super.fromJson(jsonLight);

          if(jsonLight.spot !== undefined)
          {
              fromKeys(this, jsonLight.spot);
          }
      }

      toUniform(gltf)
      {
          const uLight = new UniformLight();

          if (this.node !== undefined)
          {
              const matrix = gltf.nodes[this.node].worldTransform;

              var scale = fromValues(1, 1, 1);
              getScaling(scale, matrix);

              // To extract a correct rotation, the scaling component must be eliminated.
              const mn = create$1();
              for(const col of [0, 1, 2])
              {
                  mn[col] = matrix[col] / scale[0];
                  mn[col + 4] = matrix[col + 4] / scale[1];
                  mn[col + 8] = matrix[col + 8] / scale[2];
              }
              var rotation = create$4();
              getRotation(rotation, mn);
              normalize$2(rotation, rotation);

              const alongNegativeZ = fromValues(0, 0, -1);
              transformQuat(uLight.direction, alongNegativeZ, rotation);

              var translation = fromValues(0, 0, 0);
              getTranslation(translation, matrix);
              uLight.position = translation;
          }

          if (this.direction !== undefined)
          {
              uLight.direction = this.direction;
          }

          uLight.range = this.range;
          uLight.color = jsToGl(this.color);
          uLight.intensity = this.intensity;

          uLight.innerConeCos = Math.cos(this.innerConeAngle);
          uLight.outerConeCos = Math.cos(this.outerConeAngle);

          switch(this.type)
          {
          case "spot":
              uLight.type = Type_Spot;
              break;
          case "point":
              uLight.type = Type_Point;
              break;
          case "directional":
          default:
              uLight.type = Type_Directional;
              break;
          }

          return uLight;
      }
  }

  const Type_Directional = 0;
  const Type_Point = 1;
  const Type_Spot = 2;

  class UniformLight extends UniformStruct
  {
      constructor()
      {
          super();

          const defaultDirection = fromValues(-0.7399, -0.6428, -0.1983);
          this.direction = defaultDirection;
          this.range = -1;

          this.color = jsToGl([1, 1, 1]);
          this.intensity = 1;

          this.position = jsToGl([0, 0, 0]);
          this.innerConeCos = 0.0;

          this.outerConeCos = Math.PI / 4;
          this.type = Type_Directional;
          this.padding1 = 0.0;
          this.padding2 = 0.0;
      }
  }

  class gltfRenderer
  {
      constructor(context)
      {
          this.shader = undefined; // current shader

          this.currentWidth = 0;
          this.currentHeight = 0;

          this.webGl = new gltfWebGl(context);

          // create render target for non transmission materials
          this.opaqueRenderTexture = 0;
          this.opaqueFramebuffer = 0;
          this.opaqueDepthTexture = 0;
          this.opaqueFramebufferWidth = 1024;
          this.opaqueFramebufferHeight = 1024;

          const shaderSources = new Map();
          shaderSources.set("primitive.vert", primitiveShader);
          shaderSources.set("pbr.frag", pbrShader);
          shaderSources.set("brdf.glsl", brdfShader);
          shaderSources.set("ibl.glsl", iblShader);
          shaderSources.set("punctual.glsl", punctualShader);
          shaderSources.set("tonemapping.glsl", tonemappingShader);
          shaderSources.set("textures.glsl", texturesShader);
          shaderSources.set("functions.glsl", shaderFunctions);
          shaderSources.set("animation.glsl", animationShader);
          shaderSources.set("cubemap.vert", cubemapVertShader);
          shaderSources.set("cubemap.frag", cubemapFragShader);

          this.shaderCache = new ShaderCache(shaderSources, this.webGl);

          let requiredWebglExtensions = [
              "EXT_texture_filter_anisotropic",
              "OES_texture_float_linear"
          ];

          this.webGl.loadWebGlExtensions(requiredWebglExtensions);

          this.visibleLights = [];

          this.viewMatrix = create$1();
          this.projMatrix = create$1();
          this.viewProjectionMatrix = create$1();

          this.currentCameraPosition = create$2();

          this.lightKey = new gltfLight();
          this.lightFill = new gltfLight();
          this.lightFill.intensity = 0.5;
          const quatKey = fromValues$2(
              -0.3535534,
              -0.353553385,
              -0.146446586,
              0.8535534);
          const quatFill = fromValues$2(
              -0.8535534,
              0.146446645,
              -0.353553325,
              -0.353553444);
          this.lightKey.direction = create$2();
          this.lightFill.direction = create$2();
          transformQuat(this.lightKey.direction, [0, 0, -1], quatKey);
          transformQuat(this.lightFill.direction, [0, 0, -1], quatFill);

          this.init();

          this.environmentRenderer = new EnvironmentRenderer(this.webGl);
      }

      /////////////////////////////////////////////////////////////////////
      // Render glTF scene graph
      /////////////////////////////////////////////////////////////////////

      // app state
      init()
      {
          const context = this.webGl.context;
          context.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, GL.NONE);
          context.enable(GL.DEPTH_TEST);
          context.depthFunc(GL.LEQUAL);
          context.colorMask(true, true, true, true);
          context.clearDepth(1.0);

          this.opaqueRenderTexture = context.createTexture();
          context.bindTexture(context.TEXTURE_2D, this.opaqueRenderTexture);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
          context.texImage2D( context.TEXTURE_2D,
                              0,
                              context.RGBA,
                              this.opaqueFramebufferWidth,
                              this.opaqueFramebufferHeight,
                              0,
                              context.RGBA,
                              context.UNSIGNED_BYTE,
                              null);
          context.bindTexture(context.TEXTURE_2D, null);

          this.opaqueDepthTexture = context.createTexture();
          context.bindTexture(context.TEXTURE_2D, this.opaqueDepthTexture);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
          context.texImage2D( context.TEXTURE_2D,
                              0,
                              context.DEPTH_COMPONENT16,
                              this.opaqueFramebufferWidth,
                              this.opaqueFramebufferHeight,
                              0,
                              context.DEPTH_COMPONENT,
                              context.UNSIGNED_SHORT,
                              null);
          context.bindTexture(context.TEXTURE_2D, null);

          this.opaqueFramebuffer = context.createFramebuffer();
          context.bindFramebuffer(context.FRAMEBUFFER, this.opaqueFramebuffer);
          context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, this.opaqueRenderTexture, 0);
          context.framebufferTexture2D(context.FRAMEBUFFER, context.DEPTH_ATTACHMENT, context.TEXTURE_2D, this.opaqueDepthTexture, 0);
          context.viewport(0, 0, this.currentWidth, this.currentHeight);
          context.bindFramebuffer(context.FRAMEBUFFER, null);

      }

      resize(width, height)
      {
          if (this.currentWidth !== width || this.currentHeight !== height)
          {
              this.currentHeight = height;
              this.currentWidth = width;
              this.webGl.context.viewport(0, 0, width, height);
          }
      }

      // frame state
      clearFrame(clearColor)
      {
          this.webGl.context.bindFramebuffer(this.webGl.context.FRAMEBUFFER, null);
          this.webGl.context.clearColor(clearColor[0] / 255.0, clearColor[1] / 255.0, clearColor[2] / 255.0, clearColor[3] / 255.0);
          this.webGl.context.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
          this.webGl.context.bindFramebuffer(this.webGl.context.FRAMEBUFFER, this.opaqueFramebuffer);
          this.webGl.context.clearColor(clearColor[0] / 255.0, clearColor[1] / 255.0, clearColor[2] / 255.0, clearColor[3] / 255.0);
          this.webGl.context.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
          this.webGl.context.bindFramebuffer(this.webGl.context.FRAMEBUFFER, null);
      }

      // render complete gltf scene with given camera
      drawScene(state, scene)
      {
          let currentCamera = undefined;

          if (state.cameraIndex === undefined)
          {
              currentCamera = state.userCamera;
          }
          else
          {
              currentCamera = state.gltf.cameras[state.cameraIndex].clone();
          }

          currentCamera.aspectRatio = this.currentWidth / this.currentHeight;

          this.projMatrix = currentCamera.getProjectionMatrix();
          this.viewMatrix = currentCamera.getViewMatrix(state.gltf);
          this.currentCameraPosition = currentCamera.getPosition(state.gltf);

          this.visibleLights = this.getVisibleLights(state.gltf, scene);
          if (this.visibleLights.length === 0 && !state.renderingParameters.useIBL &&
              state.renderingParameters.useDirectionalLightsWithDisabledIBL)
          {
              this.visibleLights.push(this.lightKey);
              this.visibleLights.push(this.lightFill);
          }

          multiply$1(this.viewProjectionMatrix, this.projMatrix, this.viewMatrix);

          const nodes = scene.gatherNodes(state.gltf);

          // Update skins.
          for (const node of nodes)
          {
              if (node.mesh !== undefined && node.skin !== undefined)
              {
                  this.updateSkin(state, node);
              }
          }

          // collect drawables by essentially zipping primitives (for geometry and material)
          // and nodes for the transform
          const drawables = nodes
              .filter(node => node.mesh !== undefined)
              .reduce((acc, node) => acc.concat(state.gltf.meshes[node.mesh].primitives.map( primitive => {
                  return  {node: node, primitive: primitive};
              })), [])
              .filter(({node, primitive}) => primitive.material !== undefined);

          // opaque drawables don't need sorting
          const opaqueDrawables = drawables
              .filter(({node, primitive}) => state.gltf.materials[primitive.material].alphaMode !== "BLEND"
                  && (state.gltf.materials[primitive.material].extensions === undefined
                      || state.gltf.materials[primitive.material].extensions.KHR_materials_transmission === undefined));

          // transparent drawables need sorting before they can be drawn
          let transparentDrawables = drawables
              .filter(({node, primitive}) => state.gltf.materials[primitive.material].alphaMode === "BLEND"
                  && (state.gltf.materials[primitive.material].extensions === undefined
                      || state.gltf.materials[primitive.material].extensions.KHR_materials_transmission === undefined));
          transparentDrawables = currentCamera.sortPrimitivesByDepth(state.gltf, transparentDrawables);

          // Render transmission sample texture
          this.webGl.context.bindFramebuffer(this.webGl.context.FRAMEBUFFER, this.opaqueFramebuffer);
          this.webGl.context.viewport(0, 0, this.opaqueFramebufferWidth, this.opaqueFramebufferHeight);

          // Render environment for the transmission background
          this.pushFragParameterDefines([], state);
          this.environmentRenderer.drawEnvironmentMap(this.webGl, this.viewProjectionMatrix, state, this.shaderCache, []);

          for (const drawable of opaqueDrawables)
          {
              this.drawPrimitive(state, drawable.primitive, drawable.node, this.viewProjectionMatrix);
          }
          for (const drawable of transparentDrawables)
          {
              this.drawPrimitive(state, drawable.primitive, drawable.node, this.viewProjectionMatrix);
          }

          //Reset Viewport
          this.webGl.context.viewport(0, 0,  this.currentWidth, this.currentHeight);

          //Create Framebuffer Mipmaps
          this.webGl.context.bindTexture(this.webGl.context.TEXTURE_2D, this.opaqueRenderTexture);
          this.webGl.context.generateMipmap(this.webGl.context.TEXTURE_2D);

          // Render to canvas
          this.webGl.context.bindFramebuffer(this.webGl.context.FRAMEBUFFER, null);
          this.webGl.context.viewport(0, 0,  this.currentWidth, this.currentHeight);

          // Render environment
          const fragDefines = [];
          this.pushFragParameterDefines(fragDefines, state);
          this.environmentRenderer.drawEnvironmentMap(this.webGl, this.viewProjectionMatrix, state, this.shaderCache, fragDefines);

          for (const drawable of opaqueDrawables)
          {
              this.drawPrimitive(state, drawable.primitive, drawable.node, this.viewProjectionMatrix);
          }

          // filter materials with transmission extension
          let transmissionDrawables = drawables
              .filter(({node, primitive}) => state.gltf.materials[primitive.material].extensions !== undefined
                  && state.gltf.materials[primitive.material].extensions.KHR_materials_transmission !== undefined);
          transmissionDrawables = currentCamera.sortPrimitivesByDepth(state.gltf, transmissionDrawables);
          for (const drawable of transmissionDrawables)
          {
              this.drawPrimitive(state, drawable.primitive, drawable.node, this.viewProjectionMatrix, this.opaqueRenderTexture);
          }

          for (const drawable of transparentDrawables)
          {
              this.drawPrimitive(state, drawable.primitive, drawable.node, this.viewProjectionMatrix);
          }
      }

      // vertices with given material
      drawPrimitive(state, primitive, node, viewProjectionMatrix, transmissionSampleTexture)
      {
          if (primitive.skip) return;

          let material;
          if(primitive.mappings !== undefined && state.variant != "default")
          {
              const names = state.gltf.variants.map(obj => obj.name);
              const idx = names.indexOf(state.variant);
              let materialIdx = primitive.material;
              primitive.mappings.forEach(element => {
                  if(element.variants.indexOf(idx) >= 0)
                  {
                      materialIdx = element.material;
                  }
              });
              material = state.gltf.materials[materialIdx];
          }
          else
          {
              material = state.gltf.materials[primitive.material];
          }

          //select shader permutation, compile and link program.

          let vertDefines = [];
          this.pushVertParameterDefines(vertDefines, state.renderingParameters, state.gltf, node, primitive);
          vertDefines = primitive.getDefines().concat(vertDefines);

          let fragDefines = material.getDefines(state.renderingParameters).concat(vertDefines);
          this.pushFragParameterDefines(fragDefines, state);

          const fragmentHash = this.shaderCache.selectShader(material.getShaderIdentifier(), fragDefines);
          const vertexHash = this.shaderCache.selectShader(primitive.getShaderIdentifier(), vertDefines);

          if (fragmentHash && vertexHash)
          {
              this.shader = this.shaderCache.getShaderProgram(fragmentHash, vertexHash);
          }

          if (this.shader === undefined)
          {
              return;
          }

          this.webGl.context.useProgram(this.shader.program);

          if (state.renderingParameters.usePunctual)
          {
              this.applyLights(state.gltf);
          }

          // update model dependant matrices once per node
          this.shader.updateUniform("u_ViewProjectionMatrix", viewProjectionMatrix);
          this.shader.updateUniform("u_ModelMatrix", node.worldTransform);
          this.shader.updateUniform("u_NormalMatrix", node.normalMatrix, false);
          this.shader.updateUniform("u_Exposure", state.renderingParameters.exposure, false);
          this.shader.updateUniform("u_Camera", this.currentCameraPosition, false);

          this.updateAnimationUniforms(state, node, primitive);

          if (determinant(node.worldTransform) < 0.0)
          {
              this.webGl.context.frontFace(GL.CW);
          }
          else
          {
              this.webGl.context.frontFace(GL.CCW);
          }

          if (material.doubleSided)
          {
              this.webGl.context.disable(GL.CULL_FACE);
          }
          else
          {
              this.webGl.context.enable(GL.CULL_FACE);
          }

          if (material.alphaMode === 'BLEND')
          {
              this.webGl.context.enable(GL.BLEND);
              this.webGl.context.blendFuncSeparate(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE_MINUS_SRC_ALPHA);
              this.webGl.context.blendEquation(GL.FUNC_ADD);
          }
          else
          {
              this.webGl.context.disable(GL.BLEND);
          }

          const drawIndexed = primitive.indices !== undefined;
          if (drawIndexed)
          {
              if (!this.webGl.setIndices(state.gltf, primitive.indices))
              {
                  return;
              }
          }

          let vertexCount = 0;
          for (const attribute of primitive.glAttributes)
          {
              const gltfAccessor = state.gltf.accessors[attribute.accessor];
              vertexCount = gltfAccessor.count;

              const location = this.shader.getAttributeLocation(attribute.name);
              if (location < 0)
              {
                  continue; // only skip this attribute
              }
              if (!this.webGl.enableAttribute(state.gltf, location, gltfAccessor))
              {
                  return; // skip this primitive
              }
          }

          for (let [uniform, val] of material.getProperties().entries())
          {
              this.shader.updateUniform(uniform, val, false);
          }

          for (let i = 0; i < material.textures.length; ++i)
          {
              let info = material.textures[i];
              const location = this.shader.getUniformLocation(info.samplerName);
              if (location < 0)
              {
                  continue; // only skip this texture
              }
              if (!this.webGl.setTexture(location, state.gltf, info, i)) // binds texture and sampler
              {
                  return; // skip this material
              }
          }

          let textureCount = material.textures.length;
          if (state.renderingParameters.useIBL && state.environment !== undefined)
          {
              textureCount = this.applyEnvironmentMap(state, textureCount);
          }

          if (state.renderingParameters.usePunctual && state.environment !== undefined)
          {
              this.webGl.setTexture(this.shader.getUniformLocation("u_SheenELUT"), state.environment, state.environment.sheenELUT, textureCount++);
          }

          if(transmissionSampleTexture !== undefined && (state.renderingParameters.useIBL || state.renderingParameters.usePunctual)
                      && state.environment && state.renderingParameters.enabledExtensions.KHR_materials_transmission)
          {
              this.webGl.context.activeTexture(GL.TEXTURE0 + textureCount);
              this.webGl.context.bindTexture(this.webGl.context.TEXTURE_2D, this.opaqueRenderTexture);
              this.webGl.context.uniform1i(this.shader.getUniformLocation("u_TransmissionFramebufferSampler"), textureCount);
              textureCount++;

              this.webGl.context.uniform2i(this.shader.getUniformLocation("u_TransmissionFramebufferSize"), this.opaqueFramebufferWidth, this.opaqueFramebufferHeight);

              this.webGl.context.uniformMatrix4fv(this.shader.getUniformLocation("u_ModelMatrix"),false, node.worldTransform);
              this.webGl.context.uniformMatrix4fv(this.shader.getUniformLocation("u_ViewMatrix"),false, this.viewMatrix);
              this.webGl.context.uniformMatrix4fv(this.shader.getUniformLocation("u_ProjectionMatrix"),false, this.projMatrix);

          }

          if (drawIndexed)
          {
              const indexAccessor = state.gltf.accessors[primitive.indices];
              this.webGl.context.drawElements(primitive.mode, indexAccessor.count, indexAccessor.componentType, 0);
          }
          else
          {
              this.webGl.context.drawArrays(primitive.mode, 0, vertexCount);
          }

          for (const attribute of primitive.glAttributes)
          {
              const location = this.shader.getAttributeLocation(attribute.name);
              if (location < 0)
              {
                  continue; // skip this attribute
              }
              this.webGl.context.disableVertexAttribArray(location);
          }
      }

      // returns all lights that are relevant for rendering or the default light if there are none
      getVisibleLights(gltf, scene)
      {
          let lights = [];
          for (let light of gltf.lights)
          {
              if (light.node !== undefined)
              {
                  if (scene.includesNode(gltf, light.node))
                  {
                      lights.push(light);
                  }
              }
          }
          return lights;
      }

      updateSkin(state, node)
      {
          if (state.renderingParameters.skinning && state.gltf.skins !== undefined)
          {
              const skin = state.gltf.skins[node.skin];
              skin.computeJoints(state.gltf, node);
          }
      }

      pushVertParameterDefines(vertDefines, parameters, gltf, node, primitive)
      {
          // skinning
          if (parameters.skinning && node.skin !== undefined && primitive.hasWeights && primitive.hasJoints)
          {
              const skin = gltf.skins[node.skin];

              vertDefines.push("USE_SKINNING 1");
              vertDefines.push("JOINT_COUNT " + skin.jointMatrices.length);
          }

          // morphing
          if (parameters.morphing && node.mesh !== undefined && primitive.targets.length > 0)
          {
              const mesh = gltf.meshes[node.mesh];
              if (mesh.getWeightsAnimated() !== undefined && mesh.getWeightsAnimated().length > 0)
              {
                  vertDefines.push("USE_MORPHING 1");
                  vertDefines.push("WEIGHT_COUNT " + Math.min(mesh.getWeightsAnimated().length, 8));
              }
          }
      }

      updateAnimationUniforms(state, node, primitive)
      {
          if (state.renderingParameters.skinning && node.skin !== undefined && primitive.hasWeights && primitive.hasJoints)
          {
              const skin = state.gltf.skins[node.skin];

              this.shader.updateUniform("u_jointMatrix", skin.jointMatrices);
              if(primitive.hasNormals)
              {
                  this.shader.updateUniform("u_jointNormalMatrix", skin.jointNormalMatrices);
              }
          }

          if (state.renderingParameters.morphing && node.mesh !== undefined && primitive.targets.length > 0)
          {
              const mesh = state.gltf.meshes[node.mesh];
              if (mesh.getWeightsAnimated() !== undefined && mesh.getWeightsAnimated().length > 0)
              {
                  this.shader.updateUniformArray("u_morphWeights", mesh.getWeightsAnimated());
              }
          }
      }

      pushFragParameterDefines(fragDefines, state)
      {
          if (state.renderingParameters.usePunctual)
          {
              fragDefines.push("USE_PUNCTUAL 1");
              fragDefines.push("LIGHT_COUNT " + this.visibleLights.length);
          }

          if (state.renderingParameters.useIBL && state.environment)
          {
              fragDefines.push("USE_IBL 1");
          }

          switch (state.renderingParameters.toneMap)
          {
          case (GltfState.ToneMaps.ACES_NARKOWICZ):
              fragDefines.push("TONEMAP_ACES_NARKOWICZ 1");
              break;
          case (GltfState.ToneMaps.ACES_HILL):
              fragDefines.push("TONEMAP_ACES_HILL 1");
              break;
          case (GltfState.ToneMaps.ACES_3D_COMMERCE):
              fragDefines.push("TONEMAP_ACES_3D_COMMERCE 1");
              break;
          case (GltfState.ToneMaps.NONE):
          }

          if (state.renderingParameters.debugOutput !== GltfState.DebugOutput.NONE)
          {
              fragDefines.push("DEBUG_OUTPUT 1");
          }

          switch (state.renderingParameters.debugOutput)
          {
          case (GltfState.DebugOutput.METALLIC):
              fragDefines.push("DEBUG_METALLIC 1");
              break;
          case (GltfState.DebugOutput.ROUGHNESS):
              fragDefines.push("DEBUG_ROUGHNESS 1");
              break;
          case (GltfState.DebugOutput.NORMAL):
              fragDefines.push("DEBUG_NORMAL 1");
              break;
          case (GltfState.DebugOutput.WORLDSPACENORMAL):
              fragDefines.push("DEBUG_WORLDSPACE_NORMAL 1");
              break;
          case (GltfState.DebugOutput.GEOMETRYNORMAL):
              fragDefines.push("DEBUG_GEOMETRY_NORMAL 1");
              break;
          case (GltfState.DebugOutput.TANGENT):
              fragDefines.push("DEBUG_TANGENT 1");
              break;
          case (GltfState.DebugOutput.BITANGENT):
              fragDefines.push("DEBUG_BITANGENT 1");
              break;
          case (GltfState.DebugOutput.BASECOLOR):
              fragDefines.push("DEBUG_BASECOLOR 1");
              break;
          case (GltfState.DebugOutput.OCCLUSION):
              fragDefines.push("DEBUG_OCCLUSION 1");
              break;
          case (GltfState.DebugOutput.EMISSIVE):
              fragDefines.push("DEBUG_FEMISSIVE 1");
              break;
          case (GltfState.DebugOutput.SPECULAR):
              fragDefines.push("DEBUG_FSPECULAR 1");
              break;
          case (GltfState.DebugOutput.DIFFUSE):
              fragDefines.push("DEBUG_FDIFFUSE 1");
              break;
          case (GltfState.DebugOutput.THICKNESS):
              fragDefines.push("DEBUG_THICKNESS 1");
              break;
          case (GltfState.DebugOutput.CLEARCOAT):
              fragDefines.push("DEBUG_FCLEARCOAT 1");
              break;
          case (GltfState.DebugOutput.SHEEN):
              fragDefines.push("DEBUG_FSHEEN 1");
              break;
          case (GltfState.DebugOutput.SUBSURFACE):
              fragDefines.push("DEBUG_FSUBSURFACE 1");
              break;
          case (GltfState.DebugOutput.TRANSMISSION):
              fragDefines.push("DEBUG_FTRANSMISSION 1");
              break;
          case (GltfState.DebugOutput.F0):
              fragDefines.push("DEBUG_F0 1");
              break;
          case (GltfState.DebugOutput.ALPHA):
              fragDefines.push("DEBUG_ALPHA 1");
              break;
          }
      }

      applyLights(gltf)
      {
          let uniformLights = [];
          for (let light of this.visibleLights)
          {
              uniformLights.push(light.toUniform(gltf));
          }

          if (uniformLights.length > 0)
          {
              this.shader.updateUniform("u_Lights", uniformLights);
          }
      }

      applyEnvironmentMap(state, texSlotOffset)
      {
          const environment = state.environment;
          this.webGl.setTexture(this.shader.getUniformLocation("u_LambertianEnvSampler"), environment, environment.diffuseEnvMap, texSlotOffset++);

          this.webGl.setTexture(this.shader.getUniformLocation("u_GGXEnvSampler"), environment, environment.specularEnvMap, texSlotOffset++);
          this.webGl.setTexture(this.shader.getUniformLocation("u_GGXLUT"), environment, environment.lut, texSlotOffset++);

          this.webGl.setTexture(this.shader.getUniformLocation("u_CharlieEnvSampler"), environment, environment.sheenEnvMap, texSlotOffset++);
          this.webGl.setTexture(this.shader.getUniformLocation("u_CharlieLUT"), environment, environment.sheenLUT, texSlotOffset++);

          this.shader.updateUniform("u_MipCount", environment.mipCount);

          let rotMatrix4 = create$1();
          rotateY(rotMatrix4, rotMatrix4,  state.renderingParameters.environmentRotation / 180.0 * Math.PI);
          let rotMatrix3 = create();
          fromMat4(rotMatrix3, rotMatrix4);
          this.shader.updateUniform("u_envRotation", rotMatrix3);

          return texSlotOffset;
      }

      destroy()
      {
          this.shaderCache.destroy();
      }
  }

  var bind = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach$2(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach$2(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach$2(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach$2,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM
  };

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  var cookies = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isURLSameOrigin = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  var defaults = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
    var defaultToConfig2Keys = [
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
      'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
    ];
    var directMergeKeys = ['validateStatus'];

    function getMergedValue(target, source) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge(target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    function mergeDeepProperties(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    }

    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      }
    });

    utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    utils.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys)
      .concat(directMergeKeys);

    var otherKeys = Object
      .keys(config1)
      .concat(Object.keys(config2))
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils.forEach(otherKeys, mergeDeepProperties);

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError = function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios_1;

  // Factory for creating new instances
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios.Cancel = Cancel_1;
  axios.CancelToken = CancelToken_1;
  axios.isCancel = isCancel;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;

  // Expose isAxiosError
  axios.isAxiosError = isAxiosError;

  var axios_1 = axios;

  // Allow use of default import syntax in TypeScript
  var default_1 = axios;
  axios_1.default = default_1;

  var axios$1 = axios_1;

  class gltfAccessor extends GltfObject
  {
      constructor()
      {
          super();
          this.bufferView = undefined;
          this.byteOffset = 0;
          this.componentType = undefined;
          this.normalized = false;
          this.count = undefined;
          this.type = undefined;
          this.max = undefined;
          this.min = undefined;
          this.sparse = undefined;
          this.name = undefined;

          // non gltf
          this.glBuffer = undefined;
          this.typedView = undefined;
          this.filteredView = undefined;
          this.normalizedFilteredView = undefined;
          this.normalizedTypedView = undefined;
      }

      // getTypedView provides a view to the accessors data in form of
      // a TypedArray. This data can directly be passed to vertexAttribPointer
      getTypedView(gltf)
      {
          if (this.typedView !== undefined)
          {
              return this.typedView;
          }

          if (this.bufferView !== undefined)
          {
              const bufferView = gltf.bufferViews[this.bufferView];
              const buffer = gltf.buffers[bufferView.buffer];
              const byteOffset = this.byteOffset + bufferView.byteOffset;

              const componentSize = this.getComponentSize(this.componentType);
              let componentCount = this.getComponentCount(this.type);

              let arrayLength = 0;
              if(bufferView.byteStride !== 0)
              {
                  if (componentSize !== 0)
                  {
                      arrayLength = bufferView.byteStride / componentSize * (this.count - 1) + componentCount;
                  }
                  else
                  {
                      console.warn("Invalid component type in accessor '" + (this.name ? this.name : "") + "'");
                  }
              }
              else
              {
                  arrayLength = this.count * componentCount;
              }

              if (arrayLength * componentSize > buffer.buffer.byteLength - byteOffset)
              {
                  arrayLength = (buffer.buffer.byteLength - byteOffset) / componentSize;
                  console.warn("Count in accessor '" + (this.name ? this.name : "") + "' is too large.");
              }

              switch (this.componentType)
              {
              case GL.BYTE:
                  this.typedView = new Int8Array(buffer.buffer, byteOffset, arrayLength);
                  break;
              case GL.UNSIGNED_BYTE:
                  this.typedView = new Uint8Array(buffer.buffer, byteOffset, arrayLength);
                  break;
              case GL.SHORT:
                  this.typedView = new Int16Array(buffer.buffer, byteOffset, arrayLength);
                  break;
              case GL.UNSIGNED_SHORT:
                  this.typedView = new Uint16Array(buffer.buffer, byteOffset, arrayLength);
                  break;
              case GL.UNSIGNED_INT:
                  this.typedView = new Uint32Array(buffer.buffer, byteOffset, arrayLength);
                  break;
              case GL.FLOAT:
                  this.typedView = new Float32Array(buffer.buffer, byteOffset, arrayLength);
                  break;
              }
          }

          if (this.typedView === undefined)
          {
              console.warn("Failed to convert buffer view to typed view!: " + this.bufferView);
          }
          else if (this.sparse !== undefined)
          {
              this.applySparse(gltf, this.typedView);
          }

          return this.typedView;
      }

      // getNormalizedTypedView provides an alternative view to the accessors data,
      // where quantized data is already normalized. This is useful if the data is not passed
      // to vertexAttribPointer but used immediately (like e.g. animations)
      getNormalizedTypedView(gltf)
      {
          if(this.normalizedTypedView !== undefined)
          {
              return this.normalizedTypedView;
          }

          const typedView = this.getTypedView(gltf);
          this.normalizedTypedView = this.normalized ? gltfAccessor.dequantize(typedView, this.componentType) : typedView;
          return this.normalizedTypedView;
      }

      // getDeinterlacedView provides a view to the accessors data in form of
      // a TypedArray. In contrast to getTypedView, getDeinterlacedView deinterlaces
      // data, i.e. stripping padding and unrelated components from the array. It then
      // only contains the data of the accessor
      getDeinterlacedView(gltf)
      {
          if (this.filteredView !== undefined)
          {
              return this.filteredView;
          }

          if (this.bufferView !== undefined)
          {
              const bufferView = gltf.bufferViews[this.bufferView];
              const buffer = gltf.buffers[bufferView.buffer];
              const byteOffset = this.byteOffset + bufferView.byteOffset;

              const componentSize = this.getComponentSize(this.componentType);
              const componentCount = this.getComponentCount(this.type);
              const arrayLength = this.count * componentCount;

              let stride = bufferView.byteStride !== 0 ? bufferView.byteStride : componentCount * componentSize;
              let dv = new DataView(buffer.buffer, byteOffset, this.count * stride);

              let func = 'getFloat32';
              switch (this.componentType)
              {
              case GL.BYTE:
                  this.filteredView = new Int8Array(arrayLength);
                  func = 'getInt8';
                  break;
              case GL.UNSIGNED_BYTE:
                  this.filteredView = new Uint8Array(arrayLength);
                  func = 'getUint8';
                  break;
              case GL.SHORT:
                  this.filteredView = new Int16Array(arrayLength);
                  func = 'getInt16';
                  break;
              case GL.UNSIGNED_SHORT:
                  this.filteredView = new Uint16Array(arrayLength);
                  func = 'getUint16';
                  break;
              case GL.UNSIGNED_INT:
                  this.filteredView = new Uint32Array(arrayLength);
                  func = 'getUint32';
                  break;
              case GL.FLOAT:
                  this.filteredView = new Float32Array(arrayLength);
                  func = 'getFloat32';
                  break;
              }

              for(let i = 0; i < arrayLength; ++i)
              {
                  let offset = Math.floor(i/componentCount) * stride + (i % componentCount) * componentSize;
                  this.filteredView[i] = dv[func](offset, true);
              }
          }

          if (this.filteredView === undefined)
          {
              console.warn("Failed to convert buffer view to filtered view!: " + this.bufferView);
          }
          else if (this.sparse !== undefined)
          {
              this.applySparse(gltf, this.filteredView);
          }

          return this.filteredView;
      }

      // getNormalizedDeinterlacedView provides an alternative view to the accessors data,
      // where quantized data is already normalized. This is useful if the data is not passed
      // to vertexAttribPointer but used immediately (like e.g. animations)
      getNormalizedDeinterlacedView(gltf)
      {
          if(this.normalizedFilteredView !== undefined)
          {
              return this.normalizedFilteredView;
          }

          const filteredView = this.getDeinterlacedView(gltf);
          this.normalizedFilteredView = this.normalized ? gltfAccessor.dequantize(filteredView, this.componentType) : filteredView;
          return this.normalizedFilteredView;
      }

      applySparse(gltf, view)
      {
          // Gather indices.

          const indicesBufferView = gltf.bufferViews[this.sparse.indices.bufferView];
          const indicesBuffer = gltf.buffers[indicesBufferView.buffer];
          const indicesByteOffset = this.sparse.indices.byteOffset + indicesBufferView.byteOffset;

          const indicesComponentSize = this.getComponentSize(this.sparse.indices.componentType);
          let indicesComponentCount = 1;

          if(indicesBufferView.byteStride !== 0)
          {
              indicesComponentCount = indicesBufferView.byteStride / indicesComponentSize;
          }

          const indicesArrayLength = this.sparse.count * indicesComponentCount;

          let indicesTypedView;
          switch (this.sparse.indices.componentType)
          {
          case GL.UNSIGNED_BYTE:
              indicesTypedView = new Uint8Array(indicesBuffer.buffer, indicesByteOffset, indicesArrayLength);
              break;
          case GL.UNSIGNED_SHORT:
              indicesTypedView = new Uint16Array(indicesBuffer.buffer, indicesByteOffset, indicesArrayLength);
              break;
          case GL.UNSIGNED_INT:
              indicesTypedView = new Uint32Array(indicesBuffer.buffer, indicesByteOffset, indicesArrayLength);
              break;
          }

          // Gather values.

          const valuesBufferView = gltf.bufferViews[this.sparse.values.bufferView];
          const valuesBuffer = gltf.buffers[valuesBufferView.buffer];
          const valuesByteOffset = this.sparse.values.byteOffset + valuesBufferView.byteOffset;

          const valuesComponentSize = this.getComponentSize(this.componentType);
          let valuesComponentCount = this.getComponentCount(this.type);

          if(valuesBufferView.byteStride !== 0)
          {
              valuesComponentCount = valuesBufferView.byteStride / valuesComponentSize;
          }

          const valuesArrayLength = this.sparse.count * valuesComponentCount;

          let valuesTypedView;
          switch (this.componentType)
          {
          case GL.BYTE:
              valuesTypedView = new Int8Array(valuesBuffer.buffer, valuesByteOffset, valuesArrayLength);
              break;
          case GL.UNSIGNED_BYTE:
              valuesTypedView = new Uint8Array(valuesBuffer.buffer, valuesByteOffset, valuesArrayLength);
              break;
          case GL.SHORT:
              valuesTypedView = new Int16Array(valuesBuffer.buffer, valuesByteOffset, valuesArrayLength);
              break;
          case GL.UNSIGNED_SHORT:
              valuesTypedView = new Uint16Array(valuesBuffer.buffer, valuesByteOffset, valuesArrayLength);
              break;
          case GL.UNSIGNED_INT:
              valuesTypedView = new Uint32Array(valuesBuffer.buffer, valuesByteOffset, valuesArrayLength);
              break;
          case GL.FLOAT:
              valuesTypedView = new Float32Array(valuesBuffer.buffer, valuesByteOffset, valuesArrayLength);
              break;
          }

          // Overwrite values.

          for(let i = 0; i < this.sparse.count; ++i)
          {
              for(let k = 0; k < valuesComponentCount; ++k)
              {
                  view[indicesTypedView[i] * valuesComponentCount + k] = valuesTypedView[i * valuesComponentCount + k];
              }
          }
      }

      // dequantize can be used to perform the normalization from WebGL2 vertexAttribPointer explicitly
      static dequantize(typedArray, componentType)
      {
          switch (componentType)
          {
          case GL.BYTE:
              return new Float32Array(typedArray).map(c => Math.max(c / 127.0, -1.0));
          case GL.UNSIGNED_BYTE:
              return new Float32Array(typedArray).map(c => c / 255.0);
          case GL.SHORT:
              return new Float32Array(typedArray).map(c => Math.max(c / 32767.0, -1.0));
          case GL.UNSIGNED_SHORT:
              return new Float32Array(typedArray).map(c => c / 65535.0);
          default:
              return typedArray;
          }
      }

      getComponentCount(type)
      {
          return CompononentCount.get(type);
      }

      getComponentSize(componentType)
      {
          switch (componentType)
          {
          case GL.BYTE:
          case GL.UNSIGNED_BYTE:
              return 1;
          case GL.SHORT:
          case GL.UNSIGNED_SHORT:
              return 2;
          case GL.UNSIGNED_INT:
          case GL.FLOAT:
              return 4;
          default:
              return 0;
          }
      }

      destroy()
      {
          if (this.glBuffer !== undefined)
          {
              // TODO: this breaks the dependency direction
              WebGl.context.deleteBuffer(this.glBuffer);
          }

          this.glBuffer = undefined;
      }
  }

  const CompononentCount = new Map(
      [
          ["SCALAR", 1],
          ["VEC2", 2],
          ["VEC3", 3],
          ["VEC4", 4],
          ["MAT2", 4],
          ["MAT3", 9],
          ["MAT4", 16]
      ]
  );

  class gltfBuffer extends GltfObject
  {
      constructor()
      {
          super();
          this.uri = undefined;
          this.byteLength = undefined;
          this.name = undefined;

          // non gltf
          this.buffer = undefined; // raw data blob
      }

      load(gltf, additionalFiles = undefined)
      {
          if (this.buffer !== undefined)
          {
              console.error("buffer has already been loaded");
              return;
          }

          const self = this;
          return new Promise(function(resolve)
          {
              if (!self.setBufferFromFiles(additionalFiles, resolve) &&
                  !self.setBufferFromUri(gltf, resolve))
              {
                  console.error("Was not able to resolve buffer with uri '%s'", self.uri);
                  resolve();
              }
          });
      }

      setBufferFromUri(gltf, callback)
      {
          if (this.uri === undefined)
          {
              return false;
          }

          const self = this;
          axios$1.get(getContainingFolder(gltf.path) + this.uri, { responseType: 'arraybuffer'})
              .then(function(response)
              {
                  self.buffer = response.data;
                  callback();
              });
          return true;
      }

      setBufferFromFiles(files, callback)
      {
          if (this.uri === undefined || files === undefined)
          {
              return false;
          }

          const foundFile = files.find(function(file)
          {
              if (file.name === this.uri || file.fullPath === this.uri)
              {
                  return true;
              }
          }, this);

          if (foundFile === undefined)
          {
              return false;
          }

          const self = this;
          const reader = new FileReader();
          reader.onloadend = function(event)
          {
              self.buffer = event.target.result;
              callback();
          };
          reader.readAsArrayBuffer(foundFile);

          return true;
      }
  }

  class gltfBufferView extends GltfObject
  {
      constructor()
      {
          super();
          this.buffer = undefined;
          this.byteOffset = 0;
          this.byteLength = undefined;
          this.byteStride = 0;
          this.target = undefined;
          this.name = undefined;
      }
  }

  class AsyncFileReader
  {
      static async readAsArrayBuffer(path) {
          return new Promise( (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsArrayBuffer(path);
          });
      }

      static async readAsText(path) {
          return new Promise( (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsText(path);
          });
      }

      static async readAsDataURL(path) {
          return new Promise( (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(path);
          });
      }
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var encoder = createCommonjsModule(function (module) {

  function JPEGEncoder(quality) {
  	var ffloor = Math.floor;
  	var YTable = new Array(64);
  	var UVTable = new Array(64);
  	var fdtbl_Y = new Array(64);
  	var fdtbl_UV = new Array(64);
  	var YDC_HT;
  	var UVDC_HT;
  	var YAC_HT;
  	var UVAC_HT;
  	
  	var bitcode = new Array(65535);
  	var category = new Array(65535);
  	var outputfDCTQuant = new Array(64);
  	var DU = new Array(64);
  	var byteout = [];
  	var bytenew = 0;
  	var bytepos = 7;
  	
  	var YDU = new Array(64);
  	var UDU = new Array(64);
  	var VDU = new Array(64);
  	var clt = new Array(256);
  	var RGB_YUV_TABLE = new Array(2048);
  	var currentQuality;
  	
  	var ZigZag = [
  			 0, 1, 5, 6,14,15,27,28,
  			 2, 4, 7,13,16,26,29,42,
  			 3, 8,12,17,25,30,41,43,
  			 9,11,18,24,31,40,44,53,
  			10,19,23,32,39,45,52,54,
  			20,22,33,38,46,51,55,60,
  			21,34,37,47,50,56,59,61,
  			35,36,48,49,57,58,62,63
  		];
  	
  	var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
  	var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
  	var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
  	var std_ac_luminance_values = [
  			0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
  			0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
  			0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
  			0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
  			0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
  			0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
  			0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
  			0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
  			0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
  			0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
  			0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
  			0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
  			0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
  			0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
  			0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
  			0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
  			0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
  			0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
  			0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
  			0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
  			0xf9,0xfa
  		];
  	
  	var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
  	var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
  	var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
  	var std_ac_chrominance_values = [
  			0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
  			0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
  			0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
  			0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
  			0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
  			0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
  			0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
  			0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
  			0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
  			0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
  			0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
  			0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
  			0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
  			0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
  			0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
  			0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
  			0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
  			0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
  			0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
  			0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
  			0xf9,0xfa
  		];
  	
  	function initQuantTables(sf){
  			var YQT = [
  				16, 11, 10, 16, 24, 40, 51, 61,
  				12, 12, 14, 19, 26, 58, 60, 55,
  				14, 13, 16, 24, 40, 57, 69, 56,
  				14, 17, 22, 29, 51, 87, 80, 62,
  				18, 22, 37, 56, 68,109,103, 77,
  				24, 35, 55, 64, 81,104,113, 92,
  				49, 64, 78, 87,103,121,120,101,
  				72, 92, 95, 98,112,100,103, 99
  			];
  			
  			for (var i = 0; i < 64; i++) {
  				var t = ffloor((YQT[i]*sf+50)/100);
  				if (t < 1) {
  					t = 1;
  				} else if (t > 255) {
  					t = 255;
  				}
  				YTable[ZigZag[i]] = t;
  			}
  			var UVQT = [
  				17, 18, 24, 47, 99, 99, 99, 99,
  				18, 21, 26, 66, 99, 99, 99, 99,
  				24, 26, 56, 99, 99, 99, 99, 99,
  				47, 66, 99, 99, 99, 99, 99, 99,
  				99, 99, 99, 99, 99, 99, 99, 99,
  				99, 99, 99, 99, 99, 99, 99, 99,
  				99, 99, 99, 99, 99, 99, 99, 99,
  				99, 99, 99, 99, 99, 99, 99, 99
  			];
  			for (var j = 0; j < 64; j++) {
  				var u = ffloor((UVQT[j]*sf+50)/100);
  				if (u < 1) {
  					u = 1;
  				} else if (u > 255) {
  					u = 255;
  				}
  				UVTable[ZigZag[j]] = u;
  			}
  			var aasf = [
  				1.0, 1.387039845, 1.306562965, 1.175875602,
  				1.0, 0.785694958, 0.541196100, 0.275899379
  			];
  			var k = 0;
  			for (var row = 0; row < 8; row++)
  			{
  				for (var col = 0; col < 8; col++)
  				{
  					fdtbl_Y[k]  = (1.0 / (YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
  					fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
  					k++;
  				}
  			}
  		}
  		
  		function computeHuffmanTbl(nrcodes, std_table){
  			var codevalue = 0;
  			var pos_in_table = 0;
  			var HT = new Array();
  			for (var k = 1; k <= 16; k++) {
  				for (var j = 1; j <= nrcodes[k]; j++) {
  					HT[std_table[pos_in_table]] = [];
  					HT[std_table[pos_in_table]][0] = codevalue;
  					HT[std_table[pos_in_table]][1] = k;
  					pos_in_table++;
  					codevalue++;
  				}
  				codevalue*=2;
  			}
  			return HT;
  		}
  		
  		function initHuffmanTbl()
  		{
  			YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
  			UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
  			YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
  			UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
  		}
  	
  		function initCategoryNumber()
  		{
  			var nrlower = 1;
  			var nrupper = 2;
  			for (var cat = 1; cat <= 15; cat++) {
  				//Positive numbers
  				for (var nr = nrlower; nr<nrupper; nr++) {
  					category[32767+nr] = cat;
  					bitcode[32767+nr] = [];
  					bitcode[32767+nr][1] = cat;
  					bitcode[32767+nr][0] = nr;
  				}
  				//Negative numbers
  				for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
  					category[32767+nrneg] = cat;
  					bitcode[32767+nrneg] = [];
  					bitcode[32767+nrneg][1] = cat;
  					bitcode[32767+nrneg][0] = nrupper-1+nrneg;
  				}
  				nrlower <<= 1;
  				nrupper <<= 1;
  			}
  		}
  		
  		function initRGBYUVTable() {
  			for(var i = 0; i < 256;i++) {
  				RGB_YUV_TABLE[i]      		=  19595 * i;
  				RGB_YUV_TABLE[(i+ 256)>>0] 	=  38470 * i;
  				RGB_YUV_TABLE[(i+ 512)>>0] 	=   7471 * i + 0x8000;
  				RGB_YUV_TABLE[(i+ 768)>>0] 	= -11059 * i;
  				RGB_YUV_TABLE[(i+1024)>>0] 	= -21709 * i;
  				RGB_YUV_TABLE[(i+1280)>>0] 	=  32768 * i + 0x807FFF;
  				RGB_YUV_TABLE[(i+1536)>>0] 	= -27439 * i;
  				RGB_YUV_TABLE[(i+1792)>>0] 	= - 5329 * i;
  			}
  		}
  		
  		// IO functions
  		function writeBits(bs)
  		{
  			var value = bs[0];
  			var posval = bs[1]-1;
  			while ( posval >= 0 ) {
  				if (value & (1 << posval) ) {
  					bytenew |= (1 << bytepos);
  				}
  				posval--;
  				bytepos--;
  				if (bytepos < 0) {
  					if (bytenew == 0xFF) {
  						writeByte(0xFF);
  						writeByte(0);
  					}
  					else {
  						writeByte(bytenew);
  					}
  					bytepos=7;
  					bytenew=0;
  				}
  			}
  		}
  	
  		function writeByte(value)
  		{
  			//byteout.push(clt[value]); // write char directly instead of converting later
        byteout.push(value);
  		}
  	
  		function writeWord(value)
  		{
  			writeByte((value>>8)&0xFF);
  			writeByte((value   )&0xFF);
  		}
  		
  		// DCT & quantization core
  		function fDCTQuant(data, fdtbl)
  		{
  			var d0, d1, d2, d3, d4, d5, d6, d7;
  			/* Pass 1: process rows. */
  			var dataOff=0;
  			var i;
  			var I8 = 8;
  			var I64 = 64;
  			for (i=0; i<I8; ++i)
  			{
  				d0 = data[dataOff];
  				d1 = data[dataOff+1];
  				d2 = data[dataOff+2];
  				d3 = data[dataOff+3];
  				d4 = data[dataOff+4];
  				d5 = data[dataOff+5];
  				d6 = data[dataOff+6];
  				d7 = data[dataOff+7];
  				
  				var tmp0 = d0 + d7;
  				var tmp7 = d0 - d7;
  				var tmp1 = d1 + d6;
  				var tmp6 = d1 - d6;
  				var tmp2 = d2 + d5;
  				var tmp5 = d2 - d5;
  				var tmp3 = d3 + d4;
  				var tmp4 = d3 - d4;
  	
  				/* Even part */
  				var tmp10 = tmp0 + tmp3;	/* phase 2 */
  				var tmp13 = tmp0 - tmp3;
  				var tmp11 = tmp1 + tmp2;
  				var tmp12 = tmp1 - tmp2;
  	
  				data[dataOff] = tmp10 + tmp11; /* phase 3 */
  				data[dataOff+4] = tmp10 - tmp11;
  	
  				var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
  				data[dataOff+2] = tmp13 + z1; /* phase 5 */
  				data[dataOff+6] = tmp13 - z1;
  	
  				/* Odd part */
  				tmp10 = tmp4 + tmp5; /* phase 2 */
  				tmp11 = tmp5 + tmp6;
  				tmp12 = tmp6 + tmp7;
  	
  				/* The rotator is modified from fig 4-8 to avoid extra negations. */
  				var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
  				var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
  				var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
  				var z3 = tmp11 * 0.707106781; /* c4 */
  	
  				var z11 = tmp7 + z3;	/* phase 5 */
  				var z13 = tmp7 - z3;
  	
  				data[dataOff+5] = z13 + z2;	/* phase 6 */
  				data[dataOff+3] = z13 - z2;
  				data[dataOff+1] = z11 + z4;
  				data[dataOff+7] = z11 - z4;
  	
  				dataOff += 8; /* advance pointer to next row */
  			}
  	
  			/* Pass 2: process columns. */
  			dataOff = 0;
  			for (i=0; i<I8; ++i)
  			{
  				d0 = data[dataOff];
  				d1 = data[dataOff + 8];
  				d2 = data[dataOff + 16];
  				d3 = data[dataOff + 24];
  				d4 = data[dataOff + 32];
  				d5 = data[dataOff + 40];
  				d6 = data[dataOff + 48];
  				d7 = data[dataOff + 56];
  				
  				var tmp0p2 = d0 + d7;
  				var tmp7p2 = d0 - d7;
  				var tmp1p2 = d1 + d6;
  				var tmp6p2 = d1 - d6;
  				var tmp2p2 = d2 + d5;
  				var tmp5p2 = d2 - d5;
  				var tmp3p2 = d3 + d4;
  				var tmp4p2 = d3 - d4;
  	
  				/* Even part */
  				var tmp10p2 = tmp0p2 + tmp3p2;	/* phase 2 */
  				var tmp13p2 = tmp0p2 - tmp3p2;
  				var tmp11p2 = tmp1p2 + tmp2p2;
  				var tmp12p2 = tmp1p2 - tmp2p2;
  	
  				data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
  				data[dataOff+32] = tmp10p2 - tmp11p2;
  	
  				var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
  				data[dataOff+16] = tmp13p2 + z1p2; /* phase 5 */
  				data[dataOff+48] = tmp13p2 - z1p2;
  	
  				/* Odd part */
  				tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
  				tmp11p2 = tmp5p2 + tmp6p2;
  				tmp12p2 = tmp6p2 + tmp7p2;
  	
  				/* The rotator is modified from fig 4-8 to avoid extra negations. */
  				var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
  				var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
  				var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
  				var z3p2 = tmp11p2 * 0.707106781; /* c4 */
  	
  				var z11p2 = tmp7p2 + z3p2;	/* phase 5 */
  				var z13p2 = tmp7p2 - z3p2;
  	
  				data[dataOff+40] = z13p2 + z2p2; /* phase 6 */
  				data[dataOff+24] = z13p2 - z2p2;
  				data[dataOff+ 8] = z11p2 + z4p2;
  				data[dataOff+56] = z11p2 - z4p2;
  	
  				dataOff++; /* advance pointer to next column */
  			}
  	
  			// Quantize/descale the coefficients
  			var fDCTQuant;
  			for (i=0; i<I64; ++i)
  			{
  				// Apply the quantization and scaling factor & Round to nearest integer
  				fDCTQuant = data[i]*fdtbl[i];
  				outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
  				//outputfDCTQuant[i] = fround(fDCTQuant);

  			}
  			return outputfDCTQuant;
  		}
  		
  		function writeAPP0()
  		{
  			writeWord(0xFFE0); // marker
  			writeWord(16); // length
  			writeByte(0x4A); // J
  			writeByte(0x46); // F
  			writeByte(0x49); // I
  			writeByte(0x46); // F
  			writeByte(0); // = "JFIF",'\0'
  			writeByte(1); // versionhi
  			writeByte(1); // versionlo
  			writeByte(0); // xyunits
  			writeWord(1); // xdensity
  			writeWord(1); // ydensity
  			writeByte(0); // thumbnwidth
  			writeByte(0); // thumbnheight
  		}

  		function writeAPP1(exifBuffer) {
  			if (!exifBuffer) return;

  			writeWord(0xFFE1); // APP1 marker

  			if (exifBuffer[0] === 0x45 &&
  					exifBuffer[1] === 0x78 &&
  					exifBuffer[2] === 0x69 &&
  					exifBuffer[3] === 0x66) {
  				// Buffer already starts with EXIF, just use it directly
  				writeWord(exifBuffer.length + 2); // length is buffer + length itself!
  			} else {
  				// Buffer doesn't start with EXIF, write it for them
  				writeWord(exifBuffer.length + 5 + 2); // length is buffer + EXIF\0 + length itself!
  				writeByte(0x45); // E
  				writeByte(0x78); // X
  				writeByte(0x69); // I
  				writeByte(0x66); // F
  				writeByte(0); // = "EXIF",'\0'
  			}

  			for (var i = 0; i < exifBuffer.length; i++) {
  				writeByte(exifBuffer[i]);
  			}
  		}

  		function writeSOF0(width, height)
  		{
  			writeWord(0xFFC0); // marker
  			writeWord(17);   // length, truecolor YUV JPG
  			writeByte(8);    // precision
  			writeWord(height);
  			writeWord(width);
  			writeByte(3);    // nrofcomponents
  			writeByte(1);    // IdY
  			writeByte(0x11); // HVY
  			writeByte(0);    // QTY
  			writeByte(2);    // IdU
  			writeByte(0x11); // HVU
  			writeByte(1);    // QTU
  			writeByte(3);    // IdV
  			writeByte(0x11); // HVV
  			writeByte(1);    // QTV
  		}
  	
  		function writeDQT()
  		{
  			writeWord(0xFFDB); // marker
  			writeWord(132);	   // length
  			writeByte(0);
  			for (var i=0; i<64; i++) {
  				writeByte(YTable[i]);
  			}
  			writeByte(1);
  			for (var j=0; j<64; j++) {
  				writeByte(UVTable[j]);
  			}
  		}
  	
  		function writeDHT()
  		{
  			writeWord(0xFFC4); // marker
  			writeWord(0x01A2); // length
  	
  			writeByte(0); // HTYDCinfo
  			for (var i=0; i<16; i++) {
  				writeByte(std_dc_luminance_nrcodes[i+1]);
  			}
  			for (var j=0; j<=11; j++) {
  				writeByte(std_dc_luminance_values[j]);
  			}
  	
  			writeByte(0x10); // HTYACinfo
  			for (var k=0; k<16; k++) {
  				writeByte(std_ac_luminance_nrcodes[k+1]);
  			}
  			for (var l=0; l<=161; l++) {
  				writeByte(std_ac_luminance_values[l]);
  			}
  	
  			writeByte(1); // HTUDCinfo
  			for (var m=0; m<16; m++) {
  				writeByte(std_dc_chrominance_nrcodes[m+1]);
  			}
  			for (var n=0; n<=11; n++) {
  				writeByte(std_dc_chrominance_values[n]);
  			}
  	
  			writeByte(0x11); // HTUACinfo
  			for (var o=0; o<16; o++) {
  				writeByte(std_ac_chrominance_nrcodes[o+1]);
  			}
  			for (var p=0; p<=161; p++) {
  				writeByte(std_ac_chrominance_values[p]);
  			}
  		}
  	
  		function writeSOS()
  		{
  			writeWord(0xFFDA); // marker
  			writeWord(12); // length
  			writeByte(3); // nrofcomponents
  			writeByte(1); // IdY
  			writeByte(0); // HTY
  			writeByte(2); // IdU
  			writeByte(0x11); // HTU
  			writeByte(3); // IdV
  			writeByte(0x11); // HTV
  			writeByte(0); // Ss
  			writeByte(0x3f); // Se
  			writeByte(0); // Bf
  		}
  		
  		function processDU(CDU, fdtbl, DC, HTDC, HTAC){
  			var EOB = HTAC[0x00];
  			var M16zeroes = HTAC[0xF0];
  			var pos;
  			var I16 = 16;
  			var I63 = 63;
  			var I64 = 64;
  			var DU_DCT = fDCTQuant(CDU, fdtbl);
  			//ZigZag reorder
  			for (var j=0;j<I64;++j) {
  				DU[ZigZag[j]]=DU_DCT[j];
  			}
  			var Diff = DU[0] - DC; DC = DU[0];
  			//Encode DC
  			if (Diff==0) {
  				writeBits(HTDC[0]); // Diff might be 0
  			} else {
  				pos = 32767+Diff;
  				writeBits(HTDC[category[pos]]);
  				writeBits(bitcode[pos]);
  			}
  			//Encode ACs
  			var end0pos = 63; // was const... which is crazy
  			for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {}			//end0pos = first element in reverse order !=0
  			if ( end0pos == 0) {
  				writeBits(EOB);
  				return DC;
  			}
  			var i = 1;
  			var lng;
  			while ( i <= end0pos ) {
  				var startpos = i;
  				for (; (DU[i]==0) && (i<=end0pos); ++i) {}
  				var nrzeroes = i-startpos;
  				if ( nrzeroes >= I16 ) {
  					lng = nrzeroes>>4;
  					for (var nrmarker=1; nrmarker <= lng; ++nrmarker)
  						writeBits(M16zeroes);
  					nrzeroes = nrzeroes&0xF;
  				}
  				pos = 32767+DU[i];
  				writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
  				writeBits(bitcode[pos]);
  				i++;
  			}
  			if ( end0pos != I63 ) {
  				writeBits(EOB);
  			}
  			return DC;
  		}

  		function initCharLookupTable(){
  			var sfcc = String.fromCharCode;
  			for(var i=0; i < 256; i++){ ///// ACHTUNG // 255
  				clt[i] = sfcc(i);
  			}
  		}
  		
  		this.encode = function(image,quality) // image data object
  		{
  			var time_start = new Date().getTime();
  			
  			if(quality) setQuality(quality);
  			
  			// Initialize bit writer
  			byteout = new Array();
  			bytenew=0;
  			bytepos=7;
  	
  			// Add JPEG headers
  			writeWord(0xFFD8); // SOI
  			writeAPP0();
  			writeAPP1(image.exifBuffer);
  			writeDQT();
  			writeSOF0(image.width,image.height);
  			writeDHT();
  			writeSOS();

  	
  			// Encode 8x8 macroblocks
  			var DCY=0;
  			var DCU=0;
  			var DCV=0;
  			
  			bytenew=0;
  			bytepos=7;
  			
  			
  			this.encode.displayName = "_encode_";

  			var imageData = image.data;
  			var width = image.width;
  			var height = image.height;

  			var quadWidth = width*4;
  			
  			var x, y = 0;
  			var r, g, b;
  			var start,p, col,row,pos;
  			while(y < height){
  				x = 0;
  				while(x < quadWidth){
  				start = quadWidth * y + x;
  				p = start;
  				col = -1;
  				row = 0;
  				
  				for(pos=0; pos < 64; pos++){
  					row = pos >> 3;// /8
  					col = ( pos & 7 ) * 4; // %8
  					p = start + ( row * quadWidth ) + col;		
  					
  					if(y+row >= height){ // padding bottom
  						p-= (quadWidth*(y+1+row-height));
  					}

  					if(x+col >= quadWidth){ // padding right	
  						p-= ((x+col) - quadWidth +4);
  					}
  					
  					r = imageData[ p++ ];
  					g = imageData[ p++ ];
  					b = imageData[ p++ ];
  					
  					
  					/* // calculate YUV values dynamically
  					YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
  					UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
  					VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
  					*/
  					
  					// use lookup table (slightly faster)
  					YDU[pos] = ((RGB_YUV_TABLE[r]             + RGB_YUV_TABLE[(g +  256)>>0] + RGB_YUV_TABLE[(b +  512)>>0]) >> 16)-128;
  					UDU[pos] = ((RGB_YUV_TABLE[(r +  768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
  					VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;

  				}
  				
  				DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
  				DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
  				DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
  				x+=32;
  				}
  				y+=8;
  			}
  			
  			
  			////////////////////////////////////////////////////////////////
  	
  			// Do the bit alignment of the EOI marker
  			if ( bytepos >= 0 ) {
  				var fillbits = [];
  				fillbits[1] = bytepos+1;
  				fillbits[0] = (1<<(bytepos+1))-1;
  				writeBits(fillbits);
  			}
  	
  			writeWord(0xFFD9); //EOI
        return Buffer.from(byteout);
  	};
  	
  	function setQuality(quality){
  		if (quality <= 0) {
  			quality = 1;
  		}
  		if (quality > 100) {
  			quality = 100;
  		}
  		
  		if(currentQuality == quality) return // don't recalc if unchanged
  		
  		var sf = 0;
  		if (quality < 50) {
  			sf = Math.floor(5000 / quality);
  		} else {
  			sf = Math.floor(200 - quality*2);
  		}
  		
  		initQuantTables(sf);
  		currentQuality = quality;
  		//console.log('Quality set to: '+quality +'%');
  	}
  	
  	function init(){
  		var time_start = new Date().getTime();
  		if(!quality) quality = 50;
  		// Create tables
  		initCharLookupTable();
  		initHuffmanTbl();
  		initCategoryNumber();
  		initRGBYUVTable();
  		
  		setQuality(quality);
  		var duration = new Date().getTime() - time_start;
      	//console.log('Initialization '+ duration + 'ms');
  	}
  	
  	init();
  	
  }
  {
  	module.exports = encode;
  }

  function encode(imgData, qu) {
    if (typeof qu === 'undefined') qu = 50;
    var encoder = new JPEGEncoder(qu);
  	var data = encoder.encode(imgData, qu);
    return {
      data: data,
      width: imgData.width,
      height: imgData.height
    };
  }
  });

  var decoder = createCommonjsModule(function (module) {
  /* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
  /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
  /*
     Copyright 2011 notmasteryet

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  */

  // - The JPEG specification can be found in the ITU CCITT Recommendation T.81
  //   (www.w3.org/Graphics/JPEG/itu-t81.pdf)
  // - The JFIF specification can be found in the JPEG File Interchange Format
  //   (www.w3.org/Graphics/JPEG/jfif3.pdf)
  // - The Adobe Application-Specific JPEG markers in the Supporting the DCT Filters
  //   in PostScript Level 2, Technical Note #5116
  //   (partners.adobe.com/public/developer/en/ps/sdk/5116.DCT_Filter.pdf)

  var JpegImage = (function jpegImage() {
    var dctZigZag = new Int32Array([
       0,
       1,  8,
      16,  9,  2,
       3, 10, 17, 24,
      32, 25, 18, 11, 4,
       5, 12, 19, 26, 33, 40,
      48, 41, 34, 27, 20, 13,  6,
       7, 14, 21, 28, 35, 42, 49, 56,
      57, 50, 43, 36, 29, 22, 15,
      23, 30, 37, 44, 51, 58,
      59, 52, 45, 38, 31,
      39, 46, 53, 60,
      61, 54, 47,
      55, 62,
      63
    ]);

    var dctCos1  =  4017;   // cos(pi/16)
    var dctSin1  =   799;   // sin(pi/16)
    var dctCos3  =  3406;   // cos(3*pi/16)
    var dctSin3  =  2276;   // sin(3*pi/16)
    var dctCos6  =  1567;   // cos(6*pi/16)
    var dctSin6  =  3784;   // sin(6*pi/16)
    var dctSqrt2 =  5793;   // sqrt(2)
    var dctSqrt1d2 = 2896;  // sqrt(2) / 2

    function constructor() {
    }

    function buildHuffmanTable(codeLengths, values) {
      var k = 0, code = [], i, j, length = 16;
      while (length > 0 && !codeLengths[length - 1])
        length--;
      code.push({children: [], index: 0});
      var p = code[0], q;
      for (i = 0; i < length; i++) {
        for (j = 0; j < codeLengths[i]; j++) {
          p = code.pop();
          p.children[p.index] = values[k];
          while (p.index > 0) {
            if (code.length === 0)
              throw new Error('Could not recreate Huffman Table');
            p = code.pop();
          }
          p.index++;
          code.push(p);
          while (code.length <= i) {
            code.push(q = {children: [], index: 0});
            p.children[p.index] = q.children;
            p = q;
          }
          k++;
        }
        if (i + 1 < length) {
          // p here points to last code
          code.push(q = {children: [], index: 0});
          p.children[p.index] = q.children;
          p = q;
        }
      }
      return code[0].children;
    }

    function decodeScan(data, offset,
                        frame, components, resetInterval,
                        spectralStart, spectralEnd,
                        successivePrev, successive, opts) {
      var precision = frame.precision;
      var samplesPerLine = frame.samplesPerLine;
      var scanLines = frame.scanLines;
      var mcusPerLine = frame.mcusPerLine;
      var progressive = frame.progressive;
      var maxH = frame.maxH, maxV = frame.maxV;

      var startOffset = offset, bitsData = 0, bitsCount = 0;
      function readBit() {
        if (bitsCount > 0) {
          bitsCount--;
          return (bitsData >> bitsCount) & 1;
        }
        bitsData = data[offset++];
        if (bitsData == 0xFF) {
          var nextByte = data[offset++];
          if (nextByte) {
            throw new Error("unexpected marker: " + ((bitsData << 8) | nextByte).toString(16));
          }
          // unstuff 0
        }
        bitsCount = 7;
        return bitsData >>> 7;
      }
      function decodeHuffman(tree) {
        var node = tree, bit;
        while ((bit = readBit()) !== null) {
          node = node[bit];
          if (typeof node === 'number')
            return node;
          if (typeof node !== 'object')
            throw new Error("invalid huffman sequence");
        }
        return null;
      }
      function receive(length) {
        var n = 0;
        while (length > 0) {
          var bit = readBit();
          if (bit === null) return;
          n = (n << 1) | bit;
          length--;
        }
        return n;
      }
      function receiveAndExtend(length) {
        var n = receive(length);
        if (n >= 1 << (length - 1))
          return n;
        return n + (-1 << length) + 1;
      }
      function decodeBaseline(component, zz) {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : receiveAndExtend(t);
        zz[0]= (component.pred += diff);
        var k = 1;
        while (k < 64) {
          var rs = decodeHuffman(component.huffmanTableAC);
          var s = rs & 15, r = rs >> 4;
          if (s === 0) {
            if (r < 15)
              break;
            k += 16;
            continue;
          }
          k += r;
          var z = dctZigZag[k];
          zz[z] = receiveAndExtend(s);
          k++;
        }
      }
      function decodeDCFirst(component, zz) {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
        zz[0] = (component.pred += diff);
      }
      function decodeDCSuccessive(component, zz) {
        zz[0] |= readBit() << successive;
      }
      var eobrun = 0;
      function decodeACFirst(component, zz) {
        if (eobrun > 0) {
          eobrun--;
          return;
        }
        var k = spectralStart, e = spectralEnd;
        while (k <= e) {
          var rs = decodeHuffman(component.huffmanTableAC);
          var s = rs & 15, r = rs >> 4;
          if (s === 0) {
            if (r < 15) {
              eobrun = receive(r) + (1 << r) - 1;
              break;
            }
            k += 16;
            continue;
          }
          k += r;
          var z = dctZigZag[k];
          zz[z] = receiveAndExtend(s) * (1 << successive);
          k++;
        }
      }
      var successiveACState = 0, successiveACNextValue;
      function decodeACSuccessive(component, zz) {
        var k = spectralStart, e = spectralEnd, r = 0;
        while (k <= e) {
          var z = dctZigZag[k];
          var direction = zz[z] < 0 ? -1 : 1;
          switch (successiveACState) {
          case 0: // initial state
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0) {
              if (r < 15) {
                eobrun = receive(r) + (1 << r);
                successiveACState = 4;
              } else {
                r = 16;
                successiveACState = 1;
              }
            } else {
              if (s !== 1)
                throw new Error("invalid ACn encoding");
              successiveACNextValue = receiveAndExtend(s);
              successiveACState = r ? 2 : 3;
            }
            continue;
          case 1: // skipping r zero items
          case 2:
            if (zz[z])
              zz[z] += (readBit() << successive) * direction;
            else {
              r--;
              if (r === 0)
                successiveACState = successiveACState == 2 ? 3 : 0;
            }
            break;
          case 3: // set value for a zero item
            if (zz[z])
              zz[z] += (readBit() << successive) * direction;
            else {
              zz[z] = successiveACNextValue << successive;
              successiveACState = 0;
            }
            break;
          case 4: // eob
            if (zz[z])
              zz[z] += (readBit() << successive) * direction;
            break;
          }
          k++;
        }
        if (successiveACState === 4) {
          eobrun--;
          if (eobrun === 0)
            successiveACState = 0;
        }
      }
      function decodeMcu(component, decode, mcu, row, col) {
        var mcuRow = (mcu / mcusPerLine) | 0;
        var mcuCol = mcu % mcusPerLine;
        var blockRow = mcuRow * component.v + row;
        var blockCol = mcuCol * component.h + col;
        // If the block is missing and we're in tolerant mode, just skip it.
        if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
          return;
        decode(component, component.blocks[blockRow][blockCol]);
      }
      function decodeBlock(component, decode, mcu) {
        var blockRow = (mcu / component.blocksPerLine) | 0;
        var blockCol = mcu % component.blocksPerLine;
        // If the block is missing and we're in tolerant mode, just skip it.
        if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
          return;
        decode(component, component.blocks[blockRow][blockCol]);
      }

      var componentsLength = components.length;
      var component, i, j, k, n;
      var decodeFn;
      if (progressive) {
        if (spectralStart === 0)
          decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
        else
          decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
      } else {
        decodeFn = decodeBaseline;
      }

      var mcu = 0, marker;
      var mcuExpected;
      if (componentsLength == 1) {
        mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
      } else {
        mcuExpected = mcusPerLine * frame.mcusPerColumn;
      }
      if (!resetInterval) resetInterval = mcuExpected;

      var h, v;
      while (mcu < mcuExpected) {
        // reset interval stuff
        for (i = 0; i < componentsLength; i++)
          components[i].pred = 0;
        eobrun = 0;

        if (componentsLength == 1) {
          component = components[0];
          for (n = 0; n < resetInterval; n++) {
            decodeBlock(component, decodeFn, mcu);
            mcu++;
          }
        } else {
          for (n = 0; n < resetInterval; n++) {
            for (i = 0; i < componentsLength; i++) {
              component = components[i];
              h = component.h;
              v = component.v;
              for (j = 0; j < v; j++) {
                for (k = 0; k < h; k++) {
                  decodeMcu(component, decodeFn, mcu, j, k);
                }
              }
            }
            mcu++;

            // If we've reached our expected MCU's, stop decoding
            if (mcu === mcuExpected) break;
          }
        }

        if (mcu === mcuExpected) {
          // Skip trailing bytes at the end of the scan - until we reach the next marker
          do {
            if (data[offset] === 0xFF) {
              if (data[offset + 1] !== 0x00) {
                break;
              }
            }
            offset += 1;
          } while (offset < data.length - 2);
        }

        // find marker
        bitsCount = 0;
        marker = (data[offset] << 8) | data[offset + 1];
        if (marker < 0xFF00) {
          throw new Error("marker was not found");
        }

        if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
          offset += 2;
        }
        else
          break;
      }

      return offset - startOffset;
    }

    function buildComponentData(frame, component) {
      var lines = [];
      var blocksPerLine = component.blocksPerLine;
      var blocksPerColumn = component.blocksPerColumn;
      var samplesPerLine = blocksPerLine << 3;
      // Only 1 used per invocation of this function and garbage collected after invocation, so no need to account for its memory footprint.
      var R = new Int32Array(64), r = new Uint8Array(64);

      // A port of poppler's IDCT method which in turn is taken from:
      //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
      //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
      //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
      //   988-991.
      function quantizeAndInverse(zz, dataOut, dataIn) {
        var qt = component.quantizationTable;
        var v0, v1, v2, v3, v4, v5, v6, v7, t;
        var p = dataIn;
        var i;

        // dequant
        for (i = 0; i < 64; i++)
          p[i] = zz[i] * qt[i];

        // inverse DCT on rows
        for (i = 0; i < 8; ++i) {
          var row = 8 * i;

          // check for all-zero AC coefficients
          if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
              p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
              p[7 + row] == 0) {
            t = (dctSqrt2 * p[0 + row] + 512) >> 10;
            p[0 + row] = t;
            p[1 + row] = t;
            p[2 + row] = t;
            p[3 + row] = t;
            p[4 + row] = t;
            p[5 + row] = t;
            p[6 + row] = t;
            p[7 + row] = t;
            continue;
          }

          // stage 4
          v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
          v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
          v2 = p[2 + row];
          v3 = p[6 + row];
          v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
          v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
          v5 = p[3 + row] << 4;
          v6 = p[5 + row] << 4;

          // stage 3
          t = (v0 - v1+ 1) >> 1;
          v0 = (v0 + v1 + 1) >> 1;
          v1 = t;
          t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
          v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
          v3 = t;
          t = (v4 - v6 + 1) >> 1;
          v4 = (v4 + v6 + 1) >> 1;
          v6 = t;
          t = (v7 + v5 + 1) >> 1;
          v5 = (v7 - v5 + 1) >> 1;
          v7 = t;

          // stage 2
          t = (v0 - v3 + 1) >> 1;
          v0 = (v0 + v3 + 1) >> 1;
          v3 = t;
          t = (v1 - v2 + 1) >> 1;
          v1 = (v1 + v2 + 1) >> 1;
          v2 = t;
          t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
          v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
          v7 = t;
          t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
          v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
          v6 = t;

          // stage 1
          p[0 + row] = v0 + v7;
          p[7 + row] = v0 - v7;
          p[1 + row] = v1 + v6;
          p[6 + row] = v1 - v6;
          p[2 + row] = v2 + v5;
          p[5 + row] = v2 - v5;
          p[3 + row] = v3 + v4;
          p[4 + row] = v3 - v4;
        }

        // inverse DCT on columns
        for (i = 0; i < 8; ++i) {
          var col = i;

          // check for all-zero AC coefficients
          if (p[1*8 + col] == 0 && p[2*8 + col] == 0 && p[3*8 + col] == 0 &&
              p[4*8 + col] == 0 && p[5*8 + col] == 0 && p[6*8 + col] == 0 &&
              p[7*8 + col] == 0) {
            t = (dctSqrt2 * dataIn[i+0] + 8192) >> 14;
            p[0*8 + col] = t;
            p[1*8 + col] = t;
            p[2*8 + col] = t;
            p[3*8 + col] = t;
            p[4*8 + col] = t;
            p[5*8 + col] = t;
            p[6*8 + col] = t;
            p[7*8 + col] = t;
            continue;
          }

          // stage 4
          v0 = (dctSqrt2 * p[0*8 + col] + 2048) >> 12;
          v1 = (dctSqrt2 * p[4*8 + col] + 2048) >> 12;
          v2 = p[2*8 + col];
          v3 = p[6*8 + col];
          v4 = (dctSqrt1d2 * (p[1*8 + col] - p[7*8 + col]) + 2048) >> 12;
          v7 = (dctSqrt1d2 * (p[1*8 + col] + p[7*8 + col]) + 2048) >> 12;
          v5 = p[3*8 + col];
          v6 = p[5*8 + col];

          // stage 3
          t = (v0 - v1 + 1) >> 1;
          v0 = (v0 + v1 + 1) >> 1;
          v1 = t;
          t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
          v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
          v3 = t;
          t = (v4 - v6 + 1) >> 1;
          v4 = (v4 + v6 + 1) >> 1;
          v6 = t;
          t = (v7 + v5 + 1) >> 1;
          v5 = (v7 - v5 + 1) >> 1;
          v7 = t;

          // stage 2
          t = (v0 - v3 + 1) >> 1;
          v0 = (v0 + v3 + 1) >> 1;
          v3 = t;
          t = (v1 - v2 + 1) >> 1;
          v1 = (v1 + v2 + 1) >> 1;
          v2 = t;
          t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
          v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
          v7 = t;
          t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
          v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
          v6 = t;

          // stage 1
          p[0*8 + col] = v0 + v7;
          p[7*8 + col] = v0 - v7;
          p[1*8 + col] = v1 + v6;
          p[6*8 + col] = v1 - v6;
          p[2*8 + col] = v2 + v5;
          p[5*8 + col] = v2 - v5;
          p[3*8 + col] = v3 + v4;
          p[4*8 + col] = v3 - v4;
        }

        // convert to 8-bit integers
        for (i = 0; i < 64; ++i) {
          var sample = 128 + ((p[i] + 8) >> 4);
          dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
        }
      }

      requestMemoryAllocation(samplesPerLine * blocksPerColumn * 8);

      var i, j;
      for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
        var scanLine = blockRow << 3;
        for (i = 0; i < 8; i++)
          lines.push(new Uint8Array(samplesPerLine));
        for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
          quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

          var offset = 0, sample = blockCol << 3;
          for (j = 0; j < 8; j++) {
            var line = lines[scanLine + j];
            for (i = 0; i < 8; i++)
              line[sample + i] = r[offset++];
          }
        }
      }
      return lines;
    }

    function clampTo8bit(a) {
      return a < 0 ? 0 : a > 255 ? 255 : a;
    }

    constructor.prototype = {
      load: function load(path) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = (function() {
          // TODO catch parse error
          var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
          this.parse(data);
          if (this.onload)
            this.onload();
        }).bind(this);
        xhr.send(null);
      },
      parse: function parse(data) {
        var maxResolutionInPixels = this.opts.maxResolutionInMP * 1000 * 1000;
        var offset = 0, length = data.length;
        function readUint16() {
          var value = (data[offset] << 8) | data[offset + 1];
          offset += 2;
          return value;
        }
        function readDataBlock() {
          var length = readUint16();
          var array = data.subarray(offset, offset + length - 2);
          offset += array.length;
          return array;
        }
        function prepareComponents(frame) {
          var maxH = 0, maxV = 0;
          var component, componentId;
          for (componentId in frame.components) {
            if (frame.components.hasOwnProperty(componentId)) {
              component = frame.components[componentId];
              if (maxH < component.h) maxH = component.h;
              if (maxV < component.v) maxV = component.v;
            }
          }
          var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
          var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
          for (componentId in frame.components) {
            if (frame.components.hasOwnProperty(componentId)) {
              component = frame.components[componentId];
              var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
              var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines  / 8) * component.v / maxV);
              var blocksPerLineForMcu = mcusPerLine * component.h;
              var blocksPerColumnForMcu = mcusPerColumn * component.v;
              var blocksToAllocate = blocksPerColumnForMcu * blocksPerLineForMcu;
              var blocks = [];

              // Each block is a Int32Array of length 64 (4 x 64 = 256 bytes)
              requestMemoryAllocation(blocksToAllocate * 256);

              for (var i = 0; i < blocksPerColumnForMcu; i++) {
                var row = [];
                for (var j = 0; j < blocksPerLineForMcu; j++)
                  row.push(new Int32Array(64));
                blocks.push(row);
              }
              component.blocksPerLine = blocksPerLine;
              component.blocksPerColumn = blocksPerColumn;
              component.blocks = blocks;
            }
          }
          frame.maxH = maxH;
          frame.maxV = maxV;
          frame.mcusPerLine = mcusPerLine;
          frame.mcusPerColumn = mcusPerColumn;
        }
        var jfif = null;
        var adobe = null;
        var frame, resetInterval;
        var quantizationTables = [], frames = [];
        var huffmanTablesAC = [], huffmanTablesDC = [];
        var fileMarker = readUint16();
        var malformedDataOffset = -1;
        this.comments = [];
        if (fileMarker != 0xFFD8) { // SOI (Start of Image)
          throw new Error("SOI not found");
        }

        fileMarker = readUint16();
        while (fileMarker != 0xFFD9) { // EOI (End of image)
          var i, j;
          switch(fileMarker) {
            case 0xFF00: break;
            case 0xFFE0: // APP0 (Application Specific)
            case 0xFFE1: // APP1
            case 0xFFE2: // APP2
            case 0xFFE3: // APP3
            case 0xFFE4: // APP4
            case 0xFFE5: // APP5
            case 0xFFE6: // APP6
            case 0xFFE7: // APP7
            case 0xFFE8: // APP8
            case 0xFFE9: // APP9
            case 0xFFEA: // APP10
            case 0xFFEB: // APP11
            case 0xFFEC: // APP12
            case 0xFFED: // APP13
            case 0xFFEE: // APP14
            case 0xFFEF: // APP15
            case 0xFFFE: // COM (Comment)
              var appData = readDataBlock();

              if (fileMarker === 0xFFFE) {
                var comment = String.fromCharCode.apply(null, appData);
                this.comments.push(comment);
              }

              if (fileMarker === 0xFFE0) {
                if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                  appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
                  jfif = {
                    version: { major: appData[5], minor: appData[6] },
                    densityUnits: appData[7],
                    xDensity: (appData[8] << 8) | appData[9],
                    yDensity: (appData[10] << 8) | appData[11],
                    thumbWidth: appData[12],
                    thumbHeight: appData[13],
                    thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                  };
                }
              }
              // TODO APP1 - Exif
              if (fileMarker === 0xFFE1) {
                if (appData[0] === 0x45 &&
                  appData[1] === 0x78 &&
                  appData[2] === 0x69 &&
                  appData[3] === 0x66 &&
                  appData[4] === 0) { // 'EXIF\x00'
                  this.exifBuffer = appData.subarray(5, appData.length);
                }
              }

              if (fileMarker === 0xFFEE) {
                if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                  appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
                  adobe = {
                    version: appData[6],
                    flags0: (appData[7] << 8) | appData[8],
                    flags1: (appData[9] << 8) | appData[10],
                    transformCode: appData[11]
                  };
                }
              }
              break;

            case 0xFFDB: // DQT (Define Quantization Tables)
              var quantizationTablesLength = readUint16();
              var quantizationTablesEnd = quantizationTablesLength + offset - 2;
              while (offset < quantizationTablesEnd) {
                var quantizationTableSpec = data[offset++];
                requestMemoryAllocation(64 * 4);
                var tableData = new Int32Array(64);
                if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
                  for (j = 0; j < 64; j++) {
                    var z = dctZigZag[j];
                    tableData[z] = data[offset++];
                  }
                } else if ((quantizationTableSpec >> 4) === 1) { //16 bit
                  for (j = 0; j < 64; j++) {
                    var z = dctZigZag[j];
                    tableData[z] = readUint16();
                  }
                } else
                  throw new Error("DQT: invalid table spec");
                quantizationTables[quantizationTableSpec & 15] = tableData;
              }
              break;

            case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
            case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
            case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
              readUint16(); // skip data length
              frame = {};
              frame.extended = (fileMarker === 0xFFC1);
              frame.progressive = (fileMarker === 0xFFC2);
              frame.precision = data[offset++];
              frame.scanLines = readUint16();
              frame.samplesPerLine = readUint16();
              frame.components = {};
              frame.componentsOrder = [];

              var pixelsInFrame = frame.scanLines * frame.samplesPerLine;
              if (pixelsInFrame > maxResolutionInPixels) {
                var exceededAmount = Math.ceil((pixelsInFrame - maxResolutionInPixels) / 1e6);
                throw new Error(`maxResolutionInMP limit exceeded by ${exceededAmount}MP`);
              }

              var componentsCount = data[offset++], componentId;
              for (i = 0; i < componentsCount; i++) {
                componentId = data[offset];
                var h = data[offset + 1] >> 4;
                var v = data[offset + 1] & 15;
                var qId = data[offset + 2];
                frame.componentsOrder.push(componentId);
                frame.components[componentId] = {
                  h: h,
                  v: v,
                  quantizationIdx: qId
                };
                offset += 3;
              }
              prepareComponents(frame);
              frames.push(frame);
              break;

            case 0xFFC4: // DHT (Define Huffman Tables)
              var huffmanLength = readUint16();
              for (i = 2; i < huffmanLength;) {
                var huffmanTableSpec = data[offset++];
                var codeLengths = new Uint8Array(16);
                var codeLengthSum = 0;
                for (j = 0; j < 16; j++, offset++) {
                  codeLengthSum += (codeLengths[j] = data[offset]);
                }
                requestMemoryAllocation(16 + codeLengthSum);
                var huffmanValues = new Uint8Array(codeLengthSum);
                for (j = 0; j < codeLengthSum; j++, offset++)
                  huffmanValues[j] = data[offset];
                i += 17 + codeLengthSum;

                ((huffmanTableSpec >> 4) === 0 ?
                  huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                  buildHuffmanTable(codeLengths, huffmanValues);
              }
              break;

            case 0xFFDD: // DRI (Define Restart Interval)
              readUint16(); // skip data length
              resetInterval = readUint16();
              break;

            case 0xFFDC: // Number of Lines marker
              readUint16(); // skip data length
              readUint16(); // Ignore this data since it represents the image height
              break;
              
            case 0xFFDA: // SOS (Start of Scan)
              var scanLength = readUint16();
              var selectorsCount = data[offset++];
              var components = [], component;
              for (i = 0; i < selectorsCount; i++) {
                component = frame.components[data[offset++]];
                var tableSpec = data[offset++];
                component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                components.push(component);
              }
              var spectralStart = data[offset++];
              var spectralEnd = data[offset++];
              var successiveApproximation = data[offset++];
              var processed = decodeScan(data, offset,
                frame, components, resetInterval,
                spectralStart, spectralEnd,
                successiveApproximation >> 4, successiveApproximation & 15, this.opts);
              offset += processed;
              break;

            case 0xFFFF: // Fill bytes
              if (data[offset] !== 0xFF) { // Avoid skipping a valid marker.
                offset--;
              }
              break;
            default:
              if (data[offset - 3] == 0xFF &&
                  data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
                // could be incorrect encoding -- last 0xFF byte of the previous
                // block was eaten by the encoder
                offset -= 3;
                break;
              }
              else if (fileMarker === 0xE0 || fileMarker == 0xE1) {
                // Recover from malformed APP1 markers popular in some phone models.
                // See https://github.com/eugeneware/jpeg-js/issues/82
                if (malformedDataOffset !== -1) {
                  throw new Error(`first unknown JPEG marker at offset ${malformedDataOffset.toString(16)}, second unknown JPEG marker ${fileMarker.toString(16)} at offset ${(offset - 1).toString(16)}`);
                }
                malformedDataOffset = offset - 1;
                const nextOffset = readUint16();
                if (data[offset + nextOffset - 2] === 0xFF) {
                  offset += nextOffset - 2;
                  break;
                }
              }
              throw new Error("unknown JPEG marker " + fileMarker.toString(16));
          }
          fileMarker = readUint16();
        }
        if (frames.length != 1)
          throw new Error("only single frame JPEGs supported");

        // set each frame's components quantization table
        for (var i = 0; i < frames.length; i++) {
          var cp = frames[i].components;
          for (var j in cp) {
            cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
            delete cp[j].quantizationIdx;
          }
        }

        this.width = frame.samplesPerLine;
        this.height = frame.scanLines;
        this.jfif = jfif;
        this.adobe = adobe;
        this.components = [];
        for (var i = 0; i < frame.componentsOrder.length; i++) {
          var component = frame.components[frame.componentsOrder[i]];
          this.components.push({
            lines: buildComponentData(frame, component),
            scaleX: component.h / frame.maxH,
            scaleY: component.v / frame.maxV
          });
        }
      },
      getData: function getData(width, height) {
        var scaleX = this.width / width, scaleY = this.height / height;

        var component1, component2, component3, component4;
        var component1Line, component2Line, component3Line, component4Line;
        var x, y;
        var offset = 0;
        var Y, Cb, Cr, K, C, M, Ye, R, G, B;
        var colorTransform;
        var dataLength = width * height * this.components.length;
        requestMemoryAllocation(dataLength);
        var data = new Uint8Array(dataLength);
        switch (this.components.length) {
          case 1:
            component1 = this.components[0];
            for (y = 0; y < height; y++) {
              component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
              for (x = 0; x < width; x++) {
                Y = component1Line[0 | (x * component1.scaleX * scaleX)];

                data[offset++] = Y;
              }
            }
            break;
          case 2:
            // PDF might compress two component data in custom colorspace
            component1 = this.components[0];
            component2 = this.components[1];
            for (y = 0; y < height; y++) {
              component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
              component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
              for (x = 0; x < width; x++) {
                Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                data[offset++] = Y;
                Y = component2Line[0 | (x * component2.scaleX * scaleX)];
                data[offset++] = Y;
              }
            }
            break;
          case 3:
            // The default transform for three components is true
            colorTransform = true;
            // The adobe transform marker overrides any previous setting
            if (this.adobe && this.adobe.transformCode)
              colorTransform = true;
            else if (typeof this.opts.colorTransform !== 'undefined')
              colorTransform = !!this.opts.colorTransform;

            component1 = this.components[0];
            component2 = this.components[1];
            component3 = this.components[2];
            for (y = 0; y < height; y++) {
              component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
              component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
              component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
              for (x = 0; x < width; x++) {
                if (!colorTransform) {
                  R = component1Line[0 | (x * component1.scaleX * scaleX)];
                  G = component2Line[0 | (x * component2.scaleX * scaleX)];
                  B = component3Line[0 | (x * component3.scaleX * scaleX)];
                } else {
                  Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                  Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                  Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                  R = clampTo8bit(Y + 1.402 * (Cr - 128));
                  G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                  B = clampTo8bit(Y + 1.772 * (Cb - 128));
                }

                data[offset++] = R;
                data[offset++] = G;
                data[offset++] = B;
              }
            }
            break;
          case 4:
            if (!this.adobe)
              throw new Error('Unsupported color mode (4 components)');
            // The default transform for four components is false
            colorTransform = false;
            // The adobe transform marker overrides any previous setting
            if (this.adobe && this.adobe.transformCode)
              colorTransform = true;
            else if (typeof this.opts.colorTransform !== 'undefined')
              colorTransform = !!this.opts.colorTransform;

            component1 = this.components[0];
            component2 = this.components[1];
            component3 = this.components[2];
            component4 = this.components[3];
            for (y = 0; y < height; y++) {
              component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
              component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
              component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
              component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
              for (x = 0; x < width; x++) {
                if (!colorTransform) {
                  C = component1Line[0 | (x * component1.scaleX * scaleX)];
                  M = component2Line[0 | (x * component2.scaleX * scaleX)];
                  Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                  K = component4Line[0 | (x * component4.scaleX * scaleX)];
                } else {
                  Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                  Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                  Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                  K = component4Line[0 | (x * component4.scaleX * scaleX)];

                  C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                  M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                  Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                }
                data[offset++] = 255-C;
                data[offset++] = 255-M;
                data[offset++] = 255-Ye;
                data[offset++] = 255-K;
              }
            }
            break;
          default:
            throw new Error('Unsupported color mode');
        }
        return data;
      },
      copyToImageData: function copyToImageData(imageData, formatAsRGBA) {
        var width = imageData.width, height = imageData.height;
        var imageDataArray = imageData.data;
        var data = this.getData(width, height);
        var i = 0, j = 0, x, y;
        var Y, K, C, M, R, G, B;
        switch (this.components.length) {
          case 1:
            for (y = 0; y < height; y++) {
              for (x = 0; x < width; x++) {
                Y = data[i++];

                imageDataArray[j++] = Y;
                imageDataArray[j++] = Y;
                imageDataArray[j++] = Y;
                if (formatAsRGBA) {
                  imageDataArray[j++] = 255;
                }
              }
            }
            break;
          case 3:
            for (y = 0; y < height; y++) {
              for (x = 0; x < width; x++) {
                R = data[i++];
                G = data[i++];
                B = data[i++];

                imageDataArray[j++] = R;
                imageDataArray[j++] = G;
                imageDataArray[j++] = B;
                if (formatAsRGBA) {
                  imageDataArray[j++] = 255;
                }
              }
            }
            break;
          case 4:
            for (y = 0; y < height; y++) {
              for (x = 0; x < width; x++) {
                C = data[i++];
                M = data[i++];
                Y = data[i++];
                K = data[i++];

                R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

                imageDataArray[j++] = R;
                imageDataArray[j++] = G;
                imageDataArray[j++] = B;
                if (formatAsRGBA) {
                  imageDataArray[j++] = 255;
                }
              }
            }
            break;
          default:
            throw new Error('Unsupported color mode');
        }
      }
    };


    // We cap the amount of memory used by jpeg-js to avoid unexpected OOMs from untrusted content.
    var totalBytesAllocated = 0;
    var maxMemoryUsageBytes = 0;
    function requestMemoryAllocation(increaseAmount = 0) {
      var totalMemoryImpactBytes = totalBytesAllocated + increaseAmount;
      if (totalMemoryImpactBytes > maxMemoryUsageBytes) {
        var exceededAmount = Math.ceil((totalMemoryImpactBytes - maxMemoryUsageBytes) / 1024 / 1024);
        throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${exceededAmount}MB`);
      }

      totalBytesAllocated = totalMemoryImpactBytes;
    }

    constructor.resetMaxMemoryUsage = function (maxMemoryUsageBytes_) {
      totalBytesAllocated = 0;
      maxMemoryUsageBytes = maxMemoryUsageBytes_;
    };

    constructor.getBytesAllocated = function () {
      return totalBytesAllocated;
    };

    constructor.requestMemoryAllocation = requestMemoryAllocation;

    return constructor;
  })();

  {
  	module.exports = decode;
  }

  function decode(jpegData, userOpts = {}) {
    var defaultOpts = {
      // "undefined" means "Choose whether to transform colors based on the image’s color model."
      colorTransform: undefined,
      useTArray: false,
      formatAsRGBA: true,
      tolerantDecoding: true,
      maxResolutionInMP: 100, // Don't decode more than 100 megapixels
      maxMemoryUsageInMB: 512, // Don't decode if memory footprint is more than 512MB
    };

    var opts = {...defaultOpts, ...userOpts};
    var arr = new Uint8Array(jpegData);
    var decoder = new JpegImage();
    decoder.opts = opts;
    // If this constructor ever supports async decoding this will need to be done differently.
    // Until then, treating as singleton limit is fine.
    JpegImage.resetMaxMemoryUsage(opts.maxMemoryUsageInMB * 1024 * 1024);
    decoder.parse(arr);

    var channels = (opts.formatAsRGBA) ? 4 : 3;
    var bytesNeeded = decoder.width * decoder.height * channels;
    try {
      JpegImage.requestMemoryAllocation(bytesNeeded);
      var image = {
        width: decoder.width,
        height: decoder.height,
        exifBuffer: decoder.exifBuffer,
        data: opts.useTArray ?
          new Uint8Array(bytesNeeded) :
          Buffer.alloc(bytesNeeded)
      };
      if(decoder.comments.length > 0) {
        image["comments"] = decoder.comments;
      }
    } catch (err){
      if (err instanceof RangeError){
        throw new Error("Could not allocate enough memory for the image. " +
                        "Required: " + bytesNeeded);
      } else {
        throw err;
      }
    }

    decoder.copyToImageData(image, opts.formatAsRGBA);

    return image;
  }
  });

  var jpegJs = {
    encode: encoder,
    decode: decoder
  };
  var jpegJs_2 = jpegJs.decode;

  /*
   * Copyright 2017 Sam Thorogood. All rights reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not
   * use this file except in compliance with the License. You may obtain a copy of
   * the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
   * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
   * License for the specific language governing permissions and limitations under
   * the License.
   */
  (function (scope) {
      // fail early
      if (scope['TextEncoder'] && scope['TextDecoder']) {
          return false;
      }
      /**
       * @constructor
       * @param {string=} utfLabel
       */
      function FastTextEncoder(utfLabel = 'utf-8') {
          if (utfLabel !== 'utf-8') {
              throw new RangeError(`Failed to construct 'TextEncoder': The encoding label provided ('${utfLabel}') is invalid.`);
          }
      }
      Object.defineProperty(FastTextEncoder.prototype, 'encoding', {
          value: 'utf-8',
      });
      /**
       * @param {string} string
       * @param {{stream: boolean}=} options
       * @return {!Uint8Array}
       */
      FastTextEncoder.prototype.encode = function (string, options = { stream: false }) {
          if (options.stream) {
              throw new Error(`Failed to encode: the 'stream' option is unsupported.`);
          }
          let pos = 0;
          const len = string.length;
          let at = 0; // output position
          let tlen = Math.max(32, len + (len >> 1) + 7); // 1.5x size
          let target = new Uint8Array((tlen >> 3) << 3); // ... but at 8 byte offset
          while (pos < len) {
              let value = string.charCodeAt(pos++);
              if (value >= 0xd800 && value <= 0xdbff) {
                  // high surrogate
                  if (pos < len) {
                      const extra = string.charCodeAt(pos);
                      if ((extra & 0xfc00) === 0xdc00) {
                          ++pos;
                          value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                      }
                  }
                  if (value >= 0xd800 && value <= 0xdbff) {
                      continue; // drop lone surrogate
                  }
              }
              // expand the buffer if we couldn't write 4 bytes
              if (at + 4 > target.length) {
                  tlen += 8; // minimum extra
                  tlen *= 1.0 + (pos / string.length) * 2; // take 2x the remaining
                  tlen = (tlen >> 3) << 3; // 8 byte offset
                  const update = new Uint8Array(tlen);
                  update.set(target);
                  target = update;
              }
              if ((value & 0xffffff80) === 0) {
                  // 1-byte
                  target[at++] = value; // ASCII
                  continue;
              }
              else if ((value & 0xfffff800) === 0) {
                  // 2-byte
                  target[at++] = ((value >> 6) & 0x1f) | 0xc0;
              }
              else if ((value & 0xffff0000) === 0) {
                  // 3-byte
                  target[at++] = ((value >> 12) & 0x0f) | 0xe0;
                  target[at++] = ((value >> 6) & 0x3f) | 0x80;
              }
              else if ((value & 0xffe00000) === 0) {
                  // 4-byte
                  target[at++] = ((value >> 18) & 0x07) | 0xf0;
                  target[at++] = ((value >> 12) & 0x3f) | 0x80;
                  target[at++] = ((value >> 6) & 0x3f) | 0x80;
              }
              else {
                  // FIXME: do we care
                  continue;
              }
              target[at++] = (value & 0x3f) | 0x80;
          }
          return target.slice(0, at);
      };
      /**
       * @constructor
       * @param {string=} utfLabel
       * @param {{fatal: boolean}=} options
       */
      function FastTextDecoder(utfLabel = 'utf-8', options = { fatal: false }) {
          if (utfLabel !== 'utf-8') {
              throw new RangeError(`Failed to construct 'TextDecoder': The encoding label provided ('${utfLabel}') is invalid.`);
          }
          if (options.fatal) {
              throw new Error(`Failed to construct 'TextDecoder': the 'fatal' option is unsupported.`);
          }
      }
      Object.defineProperty(FastTextDecoder.prototype, 'encoding', {
          value: 'utf-8',
      });
      Object.defineProperty(FastTextDecoder.prototype, 'fatal', { value: false });
      Object.defineProperty(FastTextDecoder.prototype, 'ignoreBOM', {
          value: false,
      });
      /**
       * @param {(!ArrayBuffer|!ArrayBufferView)} buffer
       * @param {{stream: boolean}=} options
       */
      FastTextDecoder.prototype.decode = function (buffer, options = { stream: false }) {
          if (options['stream']) {
              throw new Error(`Failed to decode: the 'stream' option is unsupported.`);
          }
          const bytes = new Uint8Array(buffer);
          let pos = 0;
          const len = bytes.length;
          const out = [];
          while (pos < len) {
              const byte1 = bytes[pos++];
              if (byte1 === 0) {
                  break; // NULL
              }
              if ((byte1 & 0x80) === 0) {
                  // 1-byte
                  out.push(byte1);
              }
              else if ((byte1 & 0xe0) === 0xc0) {
                  // 2-byte
                  const byte2 = bytes[pos++] & 0x3f;
                  out.push(((byte1 & 0x1f) << 6) | byte2);
              }
              else if ((byte1 & 0xf0) === 0xe0) {
                  const byte2 = bytes[pos++] & 0x3f;
                  const byte3 = bytes[pos++] & 0x3f;
                  out.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
              }
              else if ((byte1 & 0xf8) === 0xf0) {
                  const byte2 = bytes[pos++] & 0x3f;
                  const byte3 = bytes[pos++] & 0x3f;
                  const byte4 = bytes[pos++] & 0x3f;
                  // this can be > 0xffff, so possibly generate surrogates
                  let codepoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
                  if (codepoint > 0xffff) {
                      // codepoint &= ~0x10000;
                      codepoint -= 0x10000;
                      out.push(((codepoint >>> 10) & 0x3ff) | 0xd800);
                      codepoint = 0xdc00 | (codepoint & 0x3ff);
                  }
                  out.push(codepoint);
              }
          }
          return String.fromCharCode.apply(null, out);
      };
      scope['TextEncoder'] = FastTextEncoder;
      scope['TextDecoder'] = FastTextDecoder;
  })(typeof window !== 'undefined'
      ? window
      : typeof self !== 'undefined'
          ? self
          : undefined);

  // eslint-disable-next-line import/no-unassigned-import
  const decoder$1 = new TextDecoder('utf-8');
  function decode(bytes) {
      return decoder$1.decode(bytes);
  }
  const encoder$1 = new TextEncoder();
  function encode$1(str) {
      return encoder$1.encode(str);
  }

  const defaultByteLength = 1024 * 8;
  class IOBuffer {
      /**
       * @param data - The data to construct the IOBuffer with.
       * If data is a number, it will be the new buffer's length<br>
       * If data is `undefined`, the buffer will be initialized with a default length of 8Kb<br>
       * If data is an ArrayBuffer, SharedArrayBuffer, an ArrayBufferView (Typed Array), an IOBuffer instance,
       * or a Node.js Buffer, a view will be created over the underlying ArrayBuffer.
       * @param options
       */
      constructor(data = defaultByteLength, options = {}) {
          let dataIsGiven = false;
          if (typeof data === 'number') {
              data = new ArrayBuffer(data);
          }
          else {
              dataIsGiven = true;
              this.lastWrittenByte = data.byteLength;
          }
          const offset = options.offset ? options.offset >>> 0 : 0;
          const byteLength = data.byteLength - offset;
          let dvOffset = offset;
          if (ArrayBuffer.isView(data) || data instanceof IOBuffer) {
              if (data.byteLength !== data.buffer.byteLength) {
                  dvOffset = data.byteOffset + offset;
              }
              data = data.buffer;
          }
          if (dataIsGiven) {
              this.lastWrittenByte = byteLength;
          }
          else {
              this.lastWrittenByte = 0;
          }
          this.buffer = data;
          this.length = byteLength;
          this.byteLength = byteLength;
          this.byteOffset = dvOffset;
          this.offset = 0;
          this.littleEndian = true;
          this._data = new DataView(this.buffer, dvOffset, byteLength);
          this._mark = 0;
          this._marks = [];
      }
      /**
       * Checks if the memory allocated to the buffer is sufficient to store more
       * bytes after the offset.
       * @param byteLength - The needed memory in bytes.
       * @returns `true` if there is sufficient space and `false` otherwise.
       */
      available(byteLength = 1) {
          return this.offset + byteLength <= this.length;
      }
      /**
       * Check if little-endian mode is used for reading and writing multi-byte
       * values.
       * @returns `true` if little-endian mode is used, `false` otherwise.
       */
      isLittleEndian() {
          return this.littleEndian;
      }
      /**
       * Set little-endian mode for reading and writing multi-byte values.
       */
      setLittleEndian() {
          this.littleEndian = true;
          return this;
      }
      /**
       * Check if big-endian mode is used for reading and writing multi-byte values.
       * @returns `true` if big-endian mode is used, `false` otherwise.
       */
      isBigEndian() {
          return !this.littleEndian;
      }
      /**
       * Switches to big-endian mode for reading and writing multi-byte values.
       */
      setBigEndian() {
          this.littleEndian = false;
          return this;
      }
      /**
       * Move the pointer n bytes forward.
       * @param n - Number of bytes to skip.
       */
      skip(n = 1) {
          this.offset += n;
          return this;
      }
      /**
       * Move the pointer to the given offset.
       * @param offset
       */
      seek(offset) {
          this.offset = offset;
          return this;
      }
      /**
       * Store the current pointer offset.
       * @see {@link IOBuffer#reset}
       */
      mark() {
          this._mark = this.offset;
          return this;
      }
      /**
       * Move the pointer back to the last pointer offset set by mark.
       * @see {@link IOBuffer#mark}
       */
      reset() {
          this.offset = this._mark;
          return this;
      }
      /**
       * Push the current pointer offset to the mark stack.
       * @see {@link IOBuffer#popMark}
       */
      pushMark() {
          this._marks.push(this.offset);
          return this;
      }
      /**
       * Pop the last pointer offset from the mark stack, and set the current
       * pointer offset to the popped value.
       * @see {@link IOBuffer#pushMark}
       */
      popMark() {
          const offset = this._marks.pop();
          if (offset === undefined) {
              throw new Error('Mark stack empty');
          }
          this.seek(offset);
          return this;
      }
      /**
       * Move the pointer offset back to 0.
       */
      rewind() {
          this.offset = 0;
          return this;
      }
      /**
       * Make sure the buffer has sufficient memory to write a given byteLength at
       * the current pointer offset.
       * If the buffer's memory is insufficient, this method will create a new
       * buffer (a copy) with a length that is twice (byteLength + current offset).
       * @param byteLength
       */
      ensureAvailable(byteLength = 1) {
          if (!this.available(byteLength)) {
              const lengthNeeded = this.offset + byteLength;
              const newLength = lengthNeeded * 2;
              const newArray = new Uint8Array(newLength);
              newArray.set(new Uint8Array(this.buffer));
              this.buffer = newArray.buffer;
              this.length = this.byteLength = newLength;
              this._data = new DataView(this.buffer);
          }
          return this;
      }
      /**
       * Read a byte and return false if the byte's value is 0, or true otherwise.
       * Moves pointer forward by one byte.
       */
      readBoolean() {
          return this.readUint8() !== 0;
      }
      /**
       * Read a signed 8-bit integer and move pointer forward by 1 byte.
       */
      readInt8() {
          return this._data.getInt8(this.offset++);
      }
      /**
       * Read an unsigned 8-bit integer and move pointer forward by 1 byte.
       */
      readUint8() {
          return this._data.getUint8(this.offset++);
      }
      /**
       * Alias for {@link IOBuffer#readUint8}.
       */
      readByte() {
          return this.readUint8();
      }
      /**
       * Read `n` bytes and move pointer forward by `n` bytes.
       */
      readBytes(n = 1) {
          const bytes = new Uint8Array(n);
          for (let i = 0; i < n; i++) {
              bytes[i] = this.readByte();
          }
          return bytes;
      }
      /**
       * Read a 16-bit signed integer and move pointer forward by 2 bytes.
       */
      readInt16() {
          const value = this._data.getInt16(this.offset, this.littleEndian);
          this.offset += 2;
          return value;
      }
      /**
       * Read a 16-bit unsigned integer and move pointer forward by 2 bytes.
       */
      readUint16() {
          const value = this._data.getUint16(this.offset, this.littleEndian);
          this.offset += 2;
          return value;
      }
      /**
       * Read a 32-bit signed integer and move pointer forward by 4 bytes.
       */
      readInt32() {
          const value = this._data.getInt32(this.offset, this.littleEndian);
          this.offset += 4;
          return value;
      }
      /**
       * Read a 32-bit unsigned integer and move pointer forward by 4 bytes.
       */
      readUint32() {
          const value = this._data.getUint32(this.offset, this.littleEndian);
          this.offset += 4;
          return value;
      }
      /**
       * Read a 32-bit floating number and move pointer forward by 4 bytes.
       */
      readFloat32() {
          const value = this._data.getFloat32(this.offset, this.littleEndian);
          this.offset += 4;
          return value;
      }
      /**
       * Read a 64-bit floating number and move pointer forward by 8 bytes.
       */
      readFloat64() {
          const value = this._data.getFloat64(this.offset, this.littleEndian);
          this.offset += 8;
          return value;
      }
      /**
       * Read a 1-byte ASCII character and move pointer forward by 1 byte.
       */
      readChar() {
          return String.fromCharCode(this.readInt8());
      }
      /**
       * Read `n` 1-byte ASCII characters and move pointer forward by `n` bytes.
       */
      readChars(n = 1) {
          let result = '';
          for (let i = 0; i < n; i++) {
              result += this.readChar();
          }
          return result;
      }
      /**
       * Read the next `n` bytes, return a UTF-8 decoded string and move pointer
       * forward by `n` bytes.
       */
      readUtf8(n = 1) {
          return decode(this.readBytes(n));
      }
      /**
       * Write 0xff if the passed value is truthy, 0x00 otherwise and move pointer
       * forward by 1 byte.
       */
      writeBoolean(value) {
          this.writeUint8(value ? 0xff : 0x00);
          return this;
      }
      /**
       * Write `value` as an 8-bit signed integer and move pointer forward by 1 byte.
       */
      writeInt8(value) {
          this.ensureAvailable(1);
          this._data.setInt8(this.offset++, value);
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as an 8-bit unsigned integer and move pointer forward by 1
       * byte.
       */
      writeUint8(value) {
          this.ensureAvailable(1);
          this._data.setUint8(this.offset++, value);
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * An alias for {@link IOBuffer#writeUint8}.
       */
      writeByte(value) {
          return this.writeUint8(value);
      }
      /**
       * Write all elements of `bytes` as uint8 values and move pointer forward by
       * `bytes.length` bytes.
       */
      writeBytes(bytes) {
          this.ensureAvailable(bytes.length);
          for (let i = 0; i < bytes.length; i++) {
              this._data.setUint8(this.offset++, bytes[i]);
          }
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as a 16-bit signed integer and move pointer forward by 2
       * bytes.
       */
      writeInt16(value) {
          this.ensureAvailable(2);
          this._data.setInt16(this.offset, value, this.littleEndian);
          this.offset += 2;
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as a 16-bit unsigned integer and move pointer forward by 2
       * bytes.
       */
      writeUint16(value) {
          this.ensureAvailable(2);
          this._data.setUint16(this.offset, value, this.littleEndian);
          this.offset += 2;
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as a 32-bit signed integer and move pointer forward by 4
       * bytes.
       */
      writeInt32(value) {
          this.ensureAvailable(4);
          this._data.setInt32(this.offset, value, this.littleEndian);
          this.offset += 4;
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as a 32-bit unsigned integer and move pointer forward by 4
       * bytes.
       */
      writeUint32(value) {
          this.ensureAvailable(4);
          this._data.setUint32(this.offset, value, this.littleEndian);
          this.offset += 4;
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as a 32-bit floating number and move pointer forward by 4
       * bytes.
       */
      writeFloat32(value) {
          this.ensureAvailable(4);
          this._data.setFloat32(this.offset, value, this.littleEndian);
          this.offset += 4;
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write `value` as a 64-bit floating number and move pointer forward by 8
       * bytes.
       */
      writeFloat64(value) {
          this.ensureAvailable(8);
          this._data.setFloat64(this.offset, value, this.littleEndian);
          this.offset += 8;
          this._updateLastWrittenByte();
          return this;
      }
      /**
       * Write the charCode of `str`'s first character as an 8-bit unsigned integer
       * and move pointer forward by 1 byte.
       */
      writeChar(str) {
          return this.writeUint8(str.charCodeAt(0));
      }
      /**
       * Write the charCodes of all `str`'s characters as 8-bit unsigned integers
       * and move pointer forward by `str.length` bytes.
       */
      writeChars(str) {
          for (let i = 0; i < str.length; i++) {
              this.writeUint8(str.charCodeAt(i));
          }
          return this;
      }
      /**
       * UTF-8 encode and write `str` to the current pointer offset and move pointer
       * forward according to the encoded length.
       */
      writeUtf8(str) {
          return this.writeBytes(encode$1(str));
      }
      /**
       * Export a Uint8Array view of the internal buffer.
       * The view starts at the byte offset and its length
       * is calculated to stop at the last written byte or the original length.
       */
      toArray() {
          return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
      }
      /**
       * Update the last written byte offset
       * @private
       */
      _updateLastWrittenByte() {
          if (this.offset > this.lastWrittenByte) {
              this.lastWrittenByte = this.offset;
          }
      }
  }

  /*! pako 2.0.3 https://github.com/nodeca/pako @license (MIT AND Zlib) */
  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  /* eslint-disable space-unary-ops */

  /* Public constants ==========================================================*/
  /* ===========================================================================*/


  //const Z_FILTERED          = 1;
  //const Z_HUFFMAN_ONLY      = 2;
  //const Z_RLE               = 3;
  const Z_FIXED               = 4;
  //const Z_DEFAULT_STRATEGY  = 0;

  /* Possible values of the data_type field (though see inflate()) */
  const Z_BINARY              = 0;
  const Z_TEXT                = 1;
  //const Z_ASCII             = 1; // = Z_TEXT
  const Z_UNKNOWN             = 2;

  /*============================================================================*/


  function zero(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

  // From zutil.h

  const STORED_BLOCK = 0;
  const STATIC_TREES = 1;
  const DYN_TREES    = 2;
  /* The three kinds of block type */

  const MIN_MATCH    = 3;
  const MAX_MATCH    = 258;
  /* The minimum and maximum match lengths */

  // From deflate.h
  /* ===========================================================================
   * Internal compression state.
   */

  const LENGTH_CODES  = 29;
  /* number of length codes, not counting the special END_BLOCK code */

  const LITERALS      = 256;
  /* number of literal bytes 0..255 */

  const L_CODES       = LITERALS + 1 + LENGTH_CODES;
  /* number of Literal or Length codes, including the END_BLOCK code */

  const D_CODES       = 30;
  /* number of distance codes */

  const BL_CODES      = 19;
  /* number of codes used to transfer the bit lengths */

  const HEAP_SIZE     = 2 * L_CODES + 1;
  /* maximum heap size */

  const MAX_BITS      = 15;
  /* All codes must not exceed MAX_BITS bits */

  const Buf_size      = 16;
  /* size of bit buffer in bi_buf */


  /* ===========================================================================
   * Constants
   */

  const MAX_BL_BITS = 7;
  /* Bit length codes must not exceed MAX_BL_BITS bits */

  const END_BLOCK   = 256;
  /* end of block literal code */

  const REP_3_6     = 16;
  /* repeat previous bit length 3-6 times (2 bits of repeat count) */

  const REPZ_3_10   = 17;
  /* repeat a zero length 3-10 times  (3 bits of repeat count) */

  const REPZ_11_138 = 18;
  /* repeat a zero length 11-138 times  (7 bits of repeat count) */

  /* eslint-disable comma-spacing,array-bracket-spacing */
  const extra_lbits =   /* extra bits for each length code */
    new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

  const extra_dbits =   /* extra bits for each distance code */
    new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

  const extra_blbits =  /* extra bits for each bit length code */
    new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

  const bl_order =
    new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
  /* eslint-enable comma-spacing,array-bracket-spacing */

  /* The lengths of the bit length codes are sent in order of decreasing
   * probability, to avoid transmitting the lengths for unused bit length codes.
   */

  /* ===========================================================================
   * Local data. These are initialized only once.
   */

  // We pre-fill arrays with 0 to avoid uninitialized gaps

  const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

  // !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
  const static_ltree  = new Array((L_CODES + 2) * 2);
  zero(static_ltree);
  /* The static literal tree. Since the bit lengths are imposed, there is no
   * need for the L_CODES extra codes used during heap construction. However
   * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
   * below).
   */

  const static_dtree  = new Array(D_CODES * 2);
  zero(static_dtree);
  /* The static distance tree. (Actually a trivial tree since all codes use
   * 5 bits.)
   */

  const _dist_code    = new Array(DIST_CODE_LEN);
  zero(_dist_code);
  /* Distance codes. The first 256 values correspond to the distances
   * 3 .. 258, the last 256 values correspond to the top 8 bits of
   * the 15 bit distances.
   */

  const _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
  zero(_length_code);
  /* length code for each normalized match length (0 == MIN_MATCH) */

  const base_length   = new Array(LENGTH_CODES);
  zero(base_length);
  /* First normalized length for each code (0 = MIN_MATCH) */

  const base_dist     = new Array(D_CODES);
  zero(base_dist);
  /* First normalized distance for each code (0 = distance of 1) */


  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

    this.static_tree  = static_tree;  /* static tree or NULL */
    this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
    this.extra_base   = extra_base;   /* base index for extra_bits */
    this.elems        = elems;        /* max number of elements in the tree */
    this.max_length   = max_length;   /* max bit length for the codes */

    // show if `static_tree` has data or dummy - needed for monomorphic objects
    this.has_stree    = static_tree && static_tree.length;
  }


  let static_l_desc;
  let static_d_desc;
  let static_bl_desc;


  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;     /* the dynamic tree */
    this.max_code = 0;            /* largest code with non zero frequency */
    this.stat_desc = stat_desc;   /* the corresponding static tree */
  }



  const d_code = (dist) => {

    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };


  /* ===========================================================================
   * Output a short LSB first on the stream.
   * IN assertion: there is enough room in pendingBuf.
   */
  const put_short = (s, w) => {
  //    put_byte(s, (uch)((w) & 0xff));
  //    put_byte(s, (uch)((ush)(w) >> 8));
    s.pending_buf[s.pending++] = (w) & 0xff;
    s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
  };


  /* ===========================================================================
   * Send a value on a given number of bits.
   * IN assertion: length <= 16 and value fits in length bits.
   */
  const send_bits = (s, value, length) => {

    if (s.bi_valid > (Buf_size - length)) {
      s.bi_buf |= (value << s.bi_valid) & 0xffff;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> (Buf_size - s.bi_valid);
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= (value << s.bi_valid) & 0xffff;
      s.bi_valid += length;
    }
  };


  const send_code = (s, c, tree) => {

    send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
  };


  /* ===========================================================================
   * Reverse the first len bits of a code, using straightforward code (a faster
   * method would use a table)
   * IN assertion: 1 <= len <= 15
   */
  const bi_reverse = (code, len) => {

    let res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };


  /* ===========================================================================
   * Flush the bit buffer, keeping at most 7 bits in it.
   */
  const bi_flush = (s) => {

    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;

    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 0xff;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };


  /* ===========================================================================
   * Compute the optimal bit lengths for a tree and update the total bit length
   * for the current block.
   * IN assertion: the fields freq and dad are set, heap[heap_max] and
   *    above are the tree nodes sorted by increasing frequency.
   * OUT assertions: the field len is set to the optimal bit length, the
   *     array bl_count contains the frequencies for each bit length.
   *     The length opt_len is updated; static_len is also updated if stree is
   *     not null.
   */
  const gen_bitlen = (s, desc) =>
  //    deflate_state *s;
  //    tree_desc *desc;    /* the tree descriptor */
  {
    const tree            = desc.dyn_tree;
    const max_code        = desc.max_code;
    const stree           = desc.stat_desc.static_tree;
    const has_stree       = desc.stat_desc.has_stree;
    const extra           = desc.stat_desc.extra_bits;
    const base            = desc.stat_desc.extra_base;
    const max_length      = desc.stat_desc.max_length;
    let h;              /* heap index */
    let n, m;           /* iterate over the tree elements */
    let bits;           /* bit length */
    let xbits;          /* extra bits */
    let f;              /* frequency */
    let overflow = 0;   /* number of elements with bit length too large */

    for (bits = 0; bits <= MAX_BITS; bits++) {
      s.bl_count[bits] = 0;
    }

    /* In a first pass, compute the optimal bit lengths (which may
     * overflow in the case of the bit length tree).
     */
    tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

    for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1]/*.Len*/ = bits;
      /* We overwrite tree[n].Dad which is no longer needed */

      if (n > max_code) { continue; } /* not a leaf node */

      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2]/*.Freq*/;
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
      }
    }
    if (overflow === 0) { return; }

    // Trace((stderr,"\nbit length overflow\n"));
    /* This happens for example on obj2 and pic of the Calgary corpus */

    /* Find the first bit length which could increase: */
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) { bits--; }
      s.bl_count[bits]--;      /* move one leaf down the tree */
      s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
      s.bl_count[max_length]--;
      /* The brother of the overflow item also moves one step up,
       * but this does not affect bl_count[max_length]
       */
      overflow -= 2;
    } while (overflow > 0);

    /* Now recompute all bit lengths, scanning in increasing frequency.
     * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
     * lengths instead of fixing only the wrong ones. This idea is taken
     * from 'ar' written by Haruhiko Okumura.)
     */
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) { continue; }
        if (tree[m * 2 + 1]/*.Len*/ !== bits) {
          // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
          s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
          tree[m * 2 + 1]/*.Len*/ = bits;
        }
        n--;
      }
    }
  };


  /* ===========================================================================
   * Generate the codes for a given tree and bit counts (which need not be
   * optimal).
   * IN assertion: the array bl_count contains the bit length statistics for
   * the given tree and the field len is set for all tree elements.
   * OUT assertion: the field code is set for all tree elements of non
   *     zero code length.
   */
  const gen_codes = (tree, max_code, bl_count) =>
  //    ct_data *tree;             /* the tree to decorate */
  //    int max_code;              /* largest code with non zero frequency */
  //    ushf *bl_count;            /* number of codes at each bit length */
  {
    const next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
    let code = 0;              /* running code value */
    let bits;                  /* bit index */
    let n;                     /* code index */

    /* The distribution counts are first used to generate the code values
     * without bit reversal.
     */
    for (bits = 1; bits <= MAX_BITS; bits++) {
      next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
    }
    /* Check that the bit counts in bl_count are consistent. The last code
     * must be all ones.
     */
    //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
    //        "inconsistent bit counts");
    //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

    for (n = 0;  n <= max_code; n++) {
      let len = tree[n * 2 + 1]/*.Len*/;
      if (len === 0) { continue; }
      /* Now reverse the bits */
      tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

      //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
      //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
    }
  };


  /* ===========================================================================
   * Initialize the various 'constant' tables.
   */
  const tr_static_init = () => {

    let n;        /* iterates over tree elements */
    let bits;     /* bit counter */
    let length;   /* length value */
    let code;     /* code value */
    let dist;     /* distance index */
    const bl_count = new Array(MAX_BITS + 1);
    /* number of codes at each bit length for an optimal tree */

    // do check in _tr_init()
    //if (static_init_done) return;

    /* For some embedded targets, global variables are not initialized: */
  /*#ifdef NO_INIT_GLOBAL_POINTERS
    static_l_desc.static_tree = static_ltree;
    static_l_desc.extra_bits = extra_lbits;
    static_d_desc.static_tree = static_dtree;
    static_d_desc.extra_bits = extra_dbits;
    static_bl_desc.extra_bits = extra_blbits;
  #endif*/

    /* Initialize the mapping length (0..255) -> length code (0..28) */
    length = 0;
    for (code = 0; code < LENGTH_CODES - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < (1 << extra_lbits[code]); n++) {
        _length_code[length++] = code;
      }
    }
    //Assert (length == 256, "tr_static_init: length != 256");
    /* Note that the length 255 (match length 258) can be represented
     * in two different ways: code 284 + 5 bits or code 285, so we
     * overwrite length_code[255] to use the best encoding:
     */
    _length_code[length - 1] = code;

    /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < (1 << extra_dbits[code]); n++) {
        _dist_code[dist++] = code;
      }
    }
    //Assert (dist == 256, "tr_static_init: dist != 256");
    dist >>= 7; /* from now on, all distances are divided by 128 */
    for (; code < D_CODES; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    //Assert (dist == 256, "tr_static_init: 256+dist != 512");

    /* Construct the codes of the static literal tree */
    for (bits = 0; bits <= MAX_BITS; bits++) {
      bl_count[bits] = 0;
    }

    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1]/*.Len*/ = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1]/*.Len*/ = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1]/*.Len*/ = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1]/*.Len*/ = 8;
      n++;
      bl_count[8]++;
    }
    /* Codes 286 and 287 do not exist, but we must include them in the
     * tree construction to get a canonical Huffman tree (longest code
     * all ones)
     */
    gen_codes(static_ltree, L_CODES + 1, bl_count);

    /* The static distance tree is trivial: */
    for (n = 0; n < D_CODES; n++) {
      static_dtree[n * 2 + 1]/*.Len*/ = 5;
      static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
    }

    // Now data ready and we can init static trees
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

    //static_init_done = true;
  };


  /* ===========================================================================
   * Initialize a new block.
   */
  const init_block = (s) => {

    let n; /* iterates over tree elements */

    /* Initialize the trees. */
    for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
    for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
    for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

    s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
    s.opt_len = s.static_len = 0;
    s.last_lit = s.matches = 0;
  };


  /* ===========================================================================
   * Flush the bit buffer and align the output on a byte boundary
   */
  const bi_windup = (s) =>
  {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      //put_byte(s, (Byte)s->bi_buf);
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  };

  /* ===========================================================================
   * Copy a stored block, storing first the length and its
   * one's complement if requested.
   */
  const copy_block = (s, buf, len, header) =>
  //DeflateState *s;
  //charf    *buf;    /* the input data */
  //unsigned len;     /* its length */
  //int      header;  /* true if block header must be written */
  {
    bi_windup(s);        /* align on byte boundary */

    if (header) {
      put_short(s, len);
      put_short(s, ~len);
    }
  //  while (len--) {
  //    put_byte(s, *buf++);
  //  }
    s.pending_buf.set(s.window.subarray(buf, buf + len), s.pending);
    s.pending += len;
  };

  /* ===========================================================================
   * Compares to subtrees, using the tree depth as tie breaker when
   * the subtrees have equal frequency. This minimizes the worst case length.
   */
  const smaller = (tree, n, m, depth) => {

    const _n2 = n * 2;
    const _m2 = m * 2;
    return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
           (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
  };

  /* ===========================================================================
   * Restore the heap property by moving down the tree starting at node k,
   * exchanging a node with the smallest of its two sons if necessary, stopping
   * when the heap property is re-established (each father smaller than its
   * two sons).
   */
  const pqdownheap = (s, tree, k) =>
  //    deflate_state *s;
  //    ct_data *tree;  /* the tree to restore */
  //    int k;               /* node to move down */
  {
    const v = s.heap[k];
    let j = k << 1;  /* left son of k */
    while (j <= s.heap_len) {
      /* Set j to the smallest of the two sons: */
      if (j < s.heap_len &&
        smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      /* Exit if v is smaller than both sons */
      if (smaller(tree, v, s.heap[j], s.depth)) { break; }

      /* Exchange v with the smallest son */
      s.heap[k] = s.heap[j];
      k = j;

      /* And continue down the tree, setting j to the left son of k */
      j <<= 1;
    }
    s.heap[k] = v;
  };


  // inlined manually
  // const SMALLEST = 1;

  /* ===========================================================================
   * Send the block data compressed using the given Huffman trees
   */
  const compress_block = (s, ltree, dtree) =>
  //    deflate_state *s;
  //    const ct_data *ltree; /* literal tree */
  //    const ct_data *dtree; /* distance tree */
  {
    let dist;           /* distance of matched string */
    let lc;             /* match length or unmatched char (if dist == 0) */
    let lx = 0;         /* running index in l_buf */
    let code;           /* the code to send */
    let extra;          /* number of extra bits to send */

    if (s.last_lit !== 0) {
      do {
        dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
        lc = s.pending_buf[s.l_buf + lx];
        lx++;

        if (dist === 0) {
          send_code(s, lc, ltree); /* send a literal byte */
          //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
        } else {
          /* Here, lc is the match length - MIN_MATCH */
          code = _length_code[lc];
          send_code(s, code + LITERALS + 1, ltree); /* send the length code */
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);       /* send the extra length bits */
          }
          dist--; /* dist is now the match distance - 1 */
          code = d_code(dist);
          //Assert (code < D_CODES, "bad d_code");

          send_code(s, code, dtree);       /* send the distance code */
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);   /* send the extra distance bits */
          }
        } /* literal or match pair ? */

        /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
        //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
        //       "pendingBuf overflow");

      } while (lx < s.last_lit);
    }

    send_code(s, END_BLOCK, ltree);
  };


  /* ===========================================================================
   * Construct one Huffman tree and assigns the code bit strings and lengths.
   * Update the total bit length for the current block.
   * IN assertion: the field freq is set for all tree elements.
   * OUT assertions: the fields len and code are set to the optimal bit length
   *     and corresponding code. The length opt_len is updated; static_len is
   *     also updated if stree is not null. The field max_code is set.
   */
  const build_tree = (s, desc) =>
  //    deflate_state *s;
  //    tree_desc *desc; /* the tree descriptor */
  {
    const tree     = desc.dyn_tree;
    const stree    = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems    = desc.stat_desc.elems;
    let n, m;          /* iterate over heap elements */
    let max_code = -1; /* largest code with non zero frequency */
    let node;          /* new node being created */

    /* Construct the initial heap, with least frequent element in
     * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
     * heap[0] is not used.
     */
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE;

    for (n = 0; n < elems; n++) {
      if (tree[n * 2]/*.Freq*/ !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;

      } else {
        tree[n * 2 + 1]/*.Len*/ = 0;
      }
    }

    /* The pkzip format requires that at least one distance code exists,
     * and that at least one bit should be sent even if there is only one
     * possible code. So to avoid special checks later on we force at least
     * two codes of non zero frequency.
     */
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
      tree[node * 2]/*.Freq*/ = 1;
      s.depth[node] = 0;
      s.opt_len--;

      if (has_stree) {
        s.static_len -= stree[node * 2 + 1]/*.Len*/;
      }
      /* node is 0 or 1 so it does not have extra bits */
    }
    desc.max_code = max_code;

    /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
     * establish sub-heaps of increasing lengths:
     */
    for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

    /* Construct the Huffman tree by repeatedly combining the least two
     * frequent nodes.
     */
    node = elems;              /* next internal node of the tree */
    do {
      //pqremove(s, tree, n);  /* n = node of least frequency */
      /*** pqremove ***/
      n = s.heap[1/*SMALLEST*/];
      s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
      pqdownheap(s, tree, 1/*SMALLEST*/);
      /***/

      m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

      s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
      s.heap[--s.heap_max] = m;

      /* Create a new node father of n and m */
      tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

      /* and insert the new node in the heap */
      s.heap[1/*SMALLEST*/] = node++;
      pqdownheap(s, tree, 1/*SMALLEST*/);

    } while (s.heap_len >= 2);

    s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

    /* At this point, the fields freq and dad are set. We can now
     * generate the bit lengths.
     */
    gen_bitlen(s, desc);

    /* The field len is now set, we can generate the bit codes */
    gen_codes(tree, max_code, s.bl_count);
  };


  /* ===========================================================================
   * Scan a literal or distance tree to determine the frequencies of the codes
   * in the bit length tree.
   */
  const scan_tree = (s, tree, max_code) =>
  //    deflate_state *s;
  //    ct_data *tree;   /* the tree to be scanned */
  //    int max_code;    /* and its largest code of non zero frequency */
  {
    let n;                     /* iterates over all tree elements */
    let prevlen = -1;          /* last emitted length */
    let curlen;                /* length of current code */

    let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

    let count = 0;             /* repeat count of the current code */
    let max_count = 7;         /* max repeat count */
    let min_count = 4;         /* min repeat count */

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

      if (++count < max_count && curlen === nextlen) {
        continue;

      } else if (count < min_count) {
        s.bl_tree[curlen * 2]/*.Freq*/ += count;

      } else if (curlen !== 0) {

        if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
        s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

      } else {
        s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
      }

      count = 0;
      prevlen = curlen;

      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;

      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;

      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };


  /* ===========================================================================
   * Send a literal or distance tree in compressed form, using the codes in
   * bl_tree.
   */
  const send_tree = (s, tree, max_code) =>
  //    deflate_state *s;
  //    ct_data *tree; /* the tree to be scanned */
  //    int max_code;       /* and its largest code of non zero frequency */
  {
    let n;                     /* iterates over all tree elements */
    let prevlen = -1;          /* last emitted length */
    let curlen;                /* length of current code */

    let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

    let count = 0;             /* repeat count of the current code */
    let max_count = 7;         /* max repeat count */
    let min_count = 4;         /* min repeat count */

    /* tree[max_code+1].Len = -1; */  /* guard already set */
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }

    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

      if (++count < max_count && curlen === nextlen) {
        continue;

      } else if (count < min_count) {
        do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        //Assert(count >= 3 && count <= 6, " 3_6?");
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);

      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);

      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }

      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;

      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;

      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };


  /* ===========================================================================
   * Construct the Huffman tree for the bit lengths and return the index in
   * bl_order of the last bit length code to send.
   */
  const build_bl_tree = (s) => {

    let max_blindex;  /* index of last bit length code of non zero freq */

    /* Determine the bit length frequencies for literal and distance trees */
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

    /* Build the bit length tree: */
    build_tree(s, s.bl_desc);
    /* opt_len now includes the length of the tree representations, except
     * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
     */

    /* Determine the number of bit length codes to send. The pkzip format
     * requires that at least 4 bit length codes be sent. (appnote.txt says
     * 3 but the actual value used is 4.)
     */
    for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
        break;
      }
    }
    /* Update opt_len to include the bit length tree and counts */
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
    //        s->opt_len, s->static_len));

    return max_blindex;
  };


  /* ===========================================================================
   * Send the header for a block using dynamic Huffman trees: the counts, the
   * lengths of the bit length codes, the literal tree and the distance tree.
   * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
   */
  const send_all_trees = (s, lcodes, dcodes, blcodes) =>
  //    deflate_state *s;
  //    int lcodes, dcodes, blcodes; /* number of codes for each tree */
  {
    let rank;                    /* index in bl_order */

    //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
    //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
    //        "too many codes");
    //Tracev((stderr, "\nbl counts: "));
    send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
    send_bits(s, dcodes - 1,   5);
    send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
    for (rank = 0; rank < blcodes; rank++) {
      //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
      send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
    }
    //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

    send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
    //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

    send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
    //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
  };


  /* ===========================================================================
   * Check if the data type is TEXT or BINARY, using the following algorithm:
   * - TEXT if the two conditions below are satisfied:
   *    a) There are no non-portable control characters belonging to the
   *       "black list" (0..6, 14..25, 28..31).
   *    b) There is at least one printable character belonging to the
   *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
   * - BINARY otherwise.
   * - The following partially-portable control characters form a
   *   "gray list" that is ignored in this detection algorithm:
   *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
   * IN assertion: the fields Freq of dyn_ltree are set.
   */
  const detect_data_type = (s) => {
    /* black_mask is the bit mask of black-listed bytes
     * set bits 0..6, 14..25, and 28..31
     * 0xf3ffc07f = binary 11110011111111111100000001111111
     */
    let black_mask = 0xf3ffc07f;
    let n;

    /* Check for non-textual ("black-listed") bytes. */
    for (n = 0; n <= 31; n++, black_mask >>>= 1) {
      if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
        return Z_BINARY;
      }
    }

    /* Check for textual ("white-listed") bytes. */
    if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
        s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS; n++) {
      if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
        return Z_TEXT;
      }
    }

    /* There are no "black-listed" or "white-listed" bytes:
     * this stream either is empty or has tolerated ("gray-listed") bytes only.
     */
    return Z_BINARY;
  };


  let static_init_done = false;

  /* ===========================================================================
   * Initialize the tree data structures for a new zlib stream.
   */
  const _tr_init = (s) =>
  {

    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }

    s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

    s.bi_buf = 0;
    s.bi_valid = 0;

    /* Initialize the first block of the first file: */
    init_block(s);
  };


  /* ===========================================================================
   * Send a stored block
   */
  const _tr_stored_block = (s, buf, stored_len, last) =>
  //DeflateState *s;
  //charf *buf;       /* input block */
  //ulg stored_len;   /* length of input block */
  //int last;         /* one if this is the last block for a file */
  {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
    copy_block(s, buf, stored_len, true); /* with header */
  };


  /* ===========================================================================
   * Send one empty static block to give enough lookahead for inflate.
   * This takes 10 bits, of which 7 may remain in the bit buffer.
   */
  const _tr_align = (s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };


  /* ===========================================================================
   * Determine the best encoding for the current block: dynamic trees, static
   * trees or store, and output the encoded block to the zip file.
   */
  const _tr_flush_block = (s, buf, stored_len, last) =>
  //DeflateState *s;
  //charf *buf;       /* input block, or NULL if too old */
  //ulg stored_len;   /* length of input block */
  //int last;         /* one if this is the last block for a file */
  {
    let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
    let max_blindex = 0;        /* index of last bit length code of non zero freq */

    /* Build the Huffman trees unless a stored block is forced */
    if (s.level > 0) {

      /* Check if the file is binary or text */
      if (s.strm.data_type === Z_UNKNOWN) {
        s.strm.data_type = detect_data_type(s);
      }

      /* Construct the literal and distance trees */
      build_tree(s, s.l_desc);
      // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
      //        s->static_len));

      build_tree(s, s.d_desc);
      // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
      //        s->static_len));
      /* At this point, opt_len and static_len are the total bit lengths of
       * the compressed block data, excluding the tree representations.
       */

      /* Build the bit length tree for the above two trees, and get the index
       * in bl_order of the last bit length code to send.
       */
      max_blindex = build_bl_tree(s);

      /* Determine the best encoding. Compute the block lengths in bytes. */
      opt_lenb = (s.opt_len + 3 + 7) >>> 3;
      static_lenb = (s.static_len + 3 + 7) >>> 3;

      // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
      //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
      //        s->last_lit));

      if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

    } else {
      // Assert(buf != (char*)0, "lost buf");
      opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
    }

    if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
      /* 4: two words for the lengths */

      /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
       * Otherwise we can't have processed more than WSIZE input bytes since
       * the last block flush, because compression would have been
       * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
       * transform a block into a stored block.
       */
      _tr_stored_block(s, buf, stored_len, last);

    } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);

    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
    /* The above check is made mod 2^32, for files larger than 512 MB
     * and uLong implemented on 32 bits.
     */
    init_block(s);

    if (last) {
      bi_windup(s);
    }
    // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
    //       s->compressed_len-7*last));
  };

  /* ===========================================================================
   * Save the match info and tally the frequency counts. Return true if
   * the current block must be flushed.
   */
  const _tr_tally = (s, dist, lc) =>
  //    deflate_state *s;
  //    unsigned dist;  /* distance of matched string */
  //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
  {
    //let out_length, in_length, dcode;

    s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
    s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

    s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
    s.last_lit++;

    if (dist === 0) {
      /* lc is the unmatched char */
      s.dyn_ltree[lc * 2]/*.Freq*/++;
    } else {
      s.matches++;
      /* Here, lc is the match length - MIN_MATCH */
      dist--;             /* dist = match distance - 1 */
      //Assert((ush)dist < (ush)MAX_DIST(s) &&
      //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
      //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

      s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
      s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
    }

  // (!) This block is disabled in zlib defaults,
  // don't enable it for binary compatibility

  //#ifdef TRUNCATE_BLOCK
  //  /* Try to guess if it is profitable to stop the current block here */
  //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
  //    /* Compute an upper bound for the compressed length */
  //    out_length = s.last_lit*8;
  //    in_length = s.strstart - s.block_start;
  //
  //    for (dcode = 0; dcode < D_CODES; dcode++) {
  //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
  //    }
  //    out_length >>>= 3;
  //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
  //    //       s->last_lit, in_length, out_length,
  //    //       100L - out_length*100L/in_length));
  //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
  //      return true;
  //    }
  //  }
  //#endif

    return (s.last_lit === s.lit_bufsize - 1);
    /* We avoid equality with lit_bufsize because of wraparound at 64K
     * on 16 bit machines and because stored blocks are restricted to
     * 64K-1 bytes.
     */
  };

  var _tr_init_1  = _tr_init;
  var _tr_stored_block_1 = _tr_stored_block;
  var _tr_flush_block_1  = _tr_flush_block;
  var _tr_tally_1 = _tr_tally;
  var _tr_align_1 = _tr_align;

  var trees = {
  	_tr_init: _tr_init_1,
  	_tr_stored_block: _tr_stored_block_1,
  	_tr_flush_block: _tr_flush_block_1,
  	_tr_tally: _tr_tally_1,
  	_tr_align: _tr_align_1
  };

  // Note: adler32 takes 12% for level 0 and 2% for level 6.
  // It isn't worth it to make additional optimizations as in original.
  // Small size is preferable.

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  const adler32 = (adler, buf, len, pos) => {
    let s1 = (adler & 0xffff) |0,
        s2 = ((adler >>> 16) & 0xffff) |0,
        n = 0;

    while (len !== 0) {
      // Set limit ~ twice less than 5552, to keep
      // s2 in 31-bits, because we force signed ints.
      // in other case %= will fail.
      n = len > 2000 ? 2000 : len;
      len -= n;

      do {
        s1 = (s1 + buf[pos++]) |0;
        s2 = (s2 + s1) |0;
      } while (--n);

      s1 %= 65521;
      s2 %= 65521;
    }

    return (s1 | (s2 << 16)) |0;
  };


  var adler32_1 = adler32;

  // Note: we can't get significant speed boost here.
  // So write code to minimize size - no pregenerated tables
  // and array tools dependencies.

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  // Use ordinary array, since untyped makes no boost here
  const makeTable = () => {
    let c, table = [];

    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c;
    }

    return table;
  };

  // Create table on load. Just 255 signed longs. Not a problem.
  const crcTable = new Uint32Array(makeTable());


  const crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;

    crc ^= -1;

    for (let i = pos; i < end; i++) {
      crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
  };


  var crc32_1 = crc32;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  var messages = {
    2:      'need dictionary',     /* Z_NEED_DICT       2  */
    1:      'stream end',          /* Z_STREAM_END      1  */
    0:      '',                    /* Z_OK              0  */
    '-1':   'file error',          /* Z_ERRNO         (-1) */
    '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
    '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
    '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
    '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
    '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  var constants = {

    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH:         0,
    Z_PARTIAL_FLUSH:    1,
    Z_SYNC_FLUSH:       2,
    Z_FULL_FLUSH:       3,
    Z_FINISH:           4,
    Z_BLOCK:            5,
    Z_TREES:            6,

    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK:               0,
    Z_STREAM_END:       1,
    Z_NEED_DICT:        2,
    Z_ERRNO:           -1,
    Z_STREAM_ERROR:    -2,
    Z_DATA_ERROR:      -3,
    Z_MEM_ERROR:       -4,
    Z_BUF_ERROR:       -5,
    //Z_VERSION_ERROR: -6,

    /* compression levels */
    Z_NO_COMPRESSION:         0,
    Z_BEST_SPEED:             1,
    Z_BEST_COMPRESSION:       9,
    Z_DEFAULT_COMPRESSION:   -1,


    Z_FILTERED:               1,
    Z_HUFFMAN_ONLY:           2,
    Z_RLE:                    3,
    Z_FIXED:                  4,
    Z_DEFAULT_STRATEGY:       0,

    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY:                 0,
    Z_TEXT:                   1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN:                2,

    /* The deflate compression method */
    Z_DEFLATED:               8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  const { _tr_init: _tr_init$1, _tr_stored_block: _tr_stored_block$1, _tr_flush_block: _tr_flush_block$1, _tr_tally: _tr_tally$1, _tr_align: _tr_align$1 } = trees;




  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  const {
    Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK,
    Z_OK, Z_STREAM_END, Z_STREAM_ERROR, Z_DATA_ERROR, Z_BUF_ERROR,
    Z_DEFAULT_COMPRESSION,
    Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED: Z_FIXED$1, Z_DEFAULT_STRATEGY,
    Z_UNKNOWN: Z_UNKNOWN$1,
    Z_DEFLATED
  } = constants;

  /*============================================================================*/


  const MAX_MEM_LEVEL = 9;
  /* Maximum value for memLevel in deflateInit2 */
  const MAX_WBITS = 15;
  /* 32K LZ77 window */
  const DEF_MEM_LEVEL = 8;


  const LENGTH_CODES$1  = 29;
  /* number of length codes, not counting the special END_BLOCK code */
  const LITERALS$1      = 256;
  /* number of literal bytes 0..255 */
  const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
  /* number of Literal or Length codes, including the END_BLOCK code */
  const D_CODES$1       = 30;
  /* number of distance codes */
  const BL_CODES$1      = 19;
  /* number of codes used to transfer the bit lengths */
  const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
  /* maximum heap size */
  const MAX_BITS$1  = 15;
  /* All codes must not exceed MAX_BITS bits */

  const MIN_MATCH$1 = 3;
  const MAX_MATCH$1 = 258;
  const MIN_LOOKAHEAD = (MAX_MATCH$1 + MIN_MATCH$1 + 1);

  const PRESET_DICT = 0x20;

  const INIT_STATE = 42;
  const EXTRA_STATE = 69;
  const NAME_STATE = 73;
  const COMMENT_STATE = 91;
  const HCRC_STATE = 103;
  const BUSY_STATE = 113;
  const FINISH_STATE = 666;

  const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
  const BS_BLOCK_DONE     = 2; /* block flush performed */
  const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
  const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

  const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

  const err = (strm, errorCode) => {
    strm.msg = messages[errorCode];
    return errorCode;
  };

  const rank = (f) => {
    return ((f) << 1) - ((f) > 4 ? 9 : 0);
  };

  const zero$1 = (buf) => {
    let len = buf.length; while (--len >= 0) { buf[len] = 0; }
  };


  /* eslint-disable new-cap */
  let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
  // This hash causes less collisions, https://github.com/nodeca/pako/issues/135
  // But breaks binary compatibility
  //let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
  let HASH = HASH_ZLIB;

  /* =========================================================================
   * Flush as much pending output as possible. All deflate() output goes
   * through this function so some applications may wish to modify it
   * to avoid allocating a large strm->output buffer and copying into it.
   * (See also read_buf()).
   */
  const flush_pending = (strm) => {
    const s = strm.state;

    //_tr_flush_bits(s);
    let len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) { return; }

    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  };


  const flush_block_only = (s, last) => {
    _tr_flush_block$1(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };


  const put_byte = (s, b) => {
    s.pending_buf[s.pending++] = b;
  };


  /* =========================================================================
   * Put a short in the pending buffer. The 16-bit value is put in MSB order.
   * IN assertion: the stream state is correct and there is enough room in
   * pending_buf.
   */
  const putShortMSB = (s, b) => {

    //  put_byte(s, (Byte)(b >> 8));
  //  put_byte(s, (Byte)(b & 0xff));
    s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
    s.pending_buf[s.pending++] = b & 0xff;
  };


  /* ===========================================================================
   * Read a new buffer from the current input stream, update the adler32
   * and total number of bytes read.  All deflate() input goes through
   * this function so some applications may wish to modify it to avoid
   * allocating a large strm->input buffer and copying from it.
   * (See also flush_pending()).
   */
  const read_buf = (strm, buf, start, size) => {

    let len = strm.avail_in;

    if (len > size) { len = size; }
    if (len === 0) { return 0; }

    strm.avail_in -= len;

    // zmemcpy(buf, strm->next_in, len);
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    }

    else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }

    strm.next_in += len;
    strm.total_in += len;

    return len;
  };


  /* ===========================================================================
   * Set match_start to the longest match starting at the given string and
   * return its length. Matches shorter or equal to prev_length are discarded,
   * in which case the result is equal to prev_length and match_start is
   * garbage.
   * IN assertions: cur_match is the head of the hash chain for the current
   *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
   * OUT assertion: the match length is not greater than s->lookahead.
   */
  const longest_match = (s, cur_match) => {

    let chain_length = s.max_chain_length;      /* max hash chain length */
    let scan = s.strstart; /* current string */
    let match;                       /* matched string */
    let len;                           /* length of current match */
    let best_len = s.prev_length;              /* best match length so far */
    let nice_match = s.nice_match;             /* stop if match long enough */
    const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
        s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

    const _win = s.window; // shortcut

    const wmask = s.w_mask;
    const prev  = s.prev;

    /* Stop when cur_match becomes <= limit. To simplify the code,
     * we prevent matches with the string of window index 0.
     */

    const strend = s.strstart + MAX_MATCH$1;
    let scan_end1  = _win[scan + best_len - 1];
    let scan_end   = _win[scan + best_len];

    /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
     * It is easy to get rid of this optimization if necessary.
     */
    // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

    /* Do not waste too much time if we already have a good match: */
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    /* Do not look for matches beyond the end of the input. This is necessary
     * to make deflate deterministic.
     */
    if (nice_match > s.lookahead) { nice_match = s.lookahead; }

    // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

    do {
      // Assert(cur_match < s->strstart, "no future");
      match = cur_match;

      /* Skip to next match if the match length cannot increase
       * or if the match length is less than 2.  Note that the checks below
       * for insufficient lookahead only occur occasionally for performance
       * reasons.  Therefore uninitialized memory will be accessed, and
       * conditional jumps will be made that depend on those values.
       * However the length of the match is limited to the lookahead, so
       * the output of deflate is not affected by the uninitialized values.
       */

      if (_win[match + best_len]     !== scan_end  ||
          _win[match + best_len - 1] !== scan_end1 ||
          _win[match]                !== _win[scan] ||
          _win[++match]              !== _win[scan + 1]) {
        continue;
      }

      /* The check at best_len-1 can be removed because it will be made
       * again later. (This heuristic is not always a win.)
       * It is not necessary to compare scan[2] and match[2] since they
       * are always equal when the other bytes match, given that
       * the hash keys are equal and that HASH_BITS >= 8.
       */
      scan += 2;
      match++;
      // Assert(*scan == *match, "match[2]?");

      /* We check for insufficient lookahead only every 8th comparison;
       * the 256th check will be made at strstart+258.
       */
      do {
        /*jshint noempty:false*/
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
               _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
               _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
               _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
               scan < strend);

      // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

      len = MAX_MATCH$1 - (strend - scan);
      scan = strend - MAX_MATCH$1;

      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1  = _win[scan + best_len - 1];
        scan_end   = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  };


  /* ===========================================================================
   * Fill the window when the lookahead becomes insufficient.
   * Updates strstart and lookahead.
   *
   * IN assertion: lookahead < MIN_LOOKAHEAD
   * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
   *    At least one byte has been read, or avail_in == 0; reads are
   *    performed for at least two bytes (required for the zip translate_eol
   *    option -- not supported here).
   */
  const fill_window = (s) => {

    const _w_size = s.w_size;
    let p, n, m, more, str;

    //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

    do {
      more = s.window_size - s.lookahead - s.strstart;

      // JS ints have 32 bit, block below not needed
      /* Deal with !@#$% 64K limit: */
      //if (sizeof(int) <= 2) {
      //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
      //        more = wsize;
      //
      //  } else if (more == (unsigned)(-1)) {
      //        /* Very unlikely, but possible on 16 bit machine if
      //         * strstart == 0 && lookahead == 1 (input done a byte at time)
      //         */
      //        more--;
      //    }
      //}


      /* If the window is almost full and there is insufficient lookahead,
       * move the upper half to the lower one to make room in the upper half.
       */
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

        s.window.set(s.window.subarray(_w_size, _w_size + _w_size), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        /* we now have strstart >= MAX_DIST */
        s.block_start -= _w_size;

        /* Slide the hash table (could be avoided with 32 bit values
         at the expense of memory usage). We slide even when level == 0
         to keep the hash table consistent if we switch back to level > 0
         later. (Using level 0 permanently is not an optimal usage of
         zlib, so we don't care about this pathological case.)
         */

        n = s.hash_size;
        p = n;

        do {
          m = s.head[--p];
          s.head[p] = (m >= _w_size ? m - _w_size : 0);
        } while (--n);

        n = _w_size;
        p = n;

        do {
          m = s.prev[--p];
          s.prev[p] = (m >= _w_size ? m - _w_size : 0);
          /* If n is not on any hash chain, prev[n] is garbage but
           * its value will never be used.
           */
        } while (--n);

        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }

      /* If there was no sliding:
       *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
       *    more == window_size - lookahead - strstart
       * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
       * => more >= window_size - 2*WSIZE + 2
       * In the BIG_MEM or MMAP case (not yet supported),
       *   window_size == input_size + MIN_LOOKAHEAD  &&
       *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
       * Otherwise, window_size == 2*WSIZE so more >= 2.
       * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
       */
      //Assert(more >= 2, "more < 2");
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;

      /* Initialize the hash value now that we have some input: */
      if (s.lookahead + s.insert >= MIN_MATCH$1) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];

        /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
  //#if MIN_MATCH != 3
  //        Call update_hash() MIN_MATCH-3 more times
  //#endif
        while (s.insert) {
          /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH$1 - 1]);

          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH$1) {
            break;
          }
        }
      }
      /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
       * but this is not important since only literal bytes will be emitted.
       */

    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

    /* If the WIN_INIT bytes after the end of the current data have never been
     * written, then zero those bytes in order to avoid memory check reports of
     * the use of uninitialized (or uninitialised as Julian writes) bytes by
     * the longest match routines.  Update the high water mark for the next
     * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
     * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
     */
  //  if (s.high_water < s.window_size) {
  //    const curr = s.strstart + s.lookahead;
  //    let init = 0;
  //
  //    if (s.high_water < curr) {
  //      /* Previous high water mark below current data -- zero WIN_INIT
  //       * bytes or up to end of window, whichever is less.
  //       */
  //      init = s.window_size - curr;
  //      if (init > WIN_INIT)
  //        init = WIN_INIT;
  //      zmemzero(s->window + curr, (unsigned)init);
  //      s->high_water = curr + init;
  //    }
  //    else if (s->high_water < (ulg)curr + WIN_INIT) {
  //      /* High water mark at or above current data, but below current data
  //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
  //       * to end of window, whichever is less.
  //       */
  //      init = (ulg)curr + WIN_INIT - s->high_water;
  //      if (init > s->window_size - s->high_water)
  //        init = s->window_size - s->high_water;
  //      zmemzero(s->window + s->high_water, (unsigned)init);
  //      s->high_water += init;
  //    }
  //  }
  //
  //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
  //    "not enough room for search");
  };

  /* ===========================================================================
   * Copy without compression as much as possible from the input stream, return
   * the current block state.
   * This function does not insert new strings in the dictionary since
   * uncompressible data is probably not useful. This function is used
   * only for the level=0 compression option.
   * NOTE: this function should be optimized to avoid extra copying from
   * window to pending_buf.
   */
  const deflate_stored = (s, flush) => {

    /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
     * to pending_buf_size, and each stored block has a 5 byte header:
     */
    let max_block_size = 0xffff;

    if (max_block_size > s.pending_buf_size - 5) {
      max_block_size = s.pending_buf_size - 5;
    }

    /* Copy as much as possible from input to output: */
    for (;;) {
      /* Fill the window as much as possible: */
      if (s.lookahead <= 1) {

        //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
        //  s->block_start >= (long)s->w_size, "slide too late");
  //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
  //        s.block_start >= s.w_size)) {
  //        throw  new Error("slide too late");
  //      }

        fill_window(s);
        if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }

        if (s.lookahead === 0) {
          break;
        }
        /* flush the current block */
      }
      //Assert(s->block_start >= 0L, "block gone");
  //    if (s.block_start < 0) throw new Error("block gone");

      s.strstart += s.lookahead;
      s.lookahead = 0;

      /* Emit a stored block if pending_buf will be full: */
      const max_start = s.block_start + max_block_size;

      if (s.strstart === 0 || s.strstart >= max_start) {
        /* strstart == 0 is possible when wraparound on 16-bit machine */
        s.lookahead = s.strstart - max_start;
        s.strstart = max_start;
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/


      }
      /* Flush if we may have to slide, otherwise block_start may become
       * negative and the data will be gone:
       */
      if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }

    s.insert = 0;

    if (flush === Z_FINISH) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }

    if (s.strstart > s.block_start) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }

    return BS_NEED_MORE;
  };

  /* ===========================================================================
   * Compress as much as possible from the input stream, return the current
   * block state.
   * This function does not perform lazy evaluation of matches and inserts
   * new strings in the dictionary only for unmatched strings or for short
   * matches. It is used only for the fast compression options.
   */
  const deflate_fast = (s, flush) => {

    let hash_head;        /* head of the hash chain */
    let bflush;           /* set if current block must be flushed */

    for (;;) {
      /* Make sure that we always have enough lookahead, except
       * at the end of the input file. We need MAX_MATCH bytes
       * for the next match, plus MIN_MATCH bytes to insert the
       * string following the next match.
       */
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break; /* flush the current block */
        }
      }

      /* Insert the string window[strstart .. strstart+2] in the
       * dictionary, and set hash_head to the head of the hash chain:
       */
      hash_head = 0/*NIL*/;
      if (s.lookahead >= MIN_MATCH$1) {
        /*** INSERT_STRING(s, s.strstart, hash_head); ***/
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH$1 - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
        /***/
      }

      /* Find the longest match, discarding those <= prev_length.
       * At this point we have always match_length < MIN_MATCH
       */
      if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
        /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
        s.match_length = longest_match(s, hash_head);
        /* longest_match() sets match_start */
      }
      if (s.match_length >= MIN_MATCH$1) {
        // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

        /*** _tr_tally_dist(s, s.strstart - s.match_start,
                       s.match_length - MIN_MATCH, bflush); ***/
        bflush = _tr_tally$1(s, s.strstart - s.match_start, s.match_length - MIN_MATCH$1);

        s.lookahead -= s.match_length;

        /* Insert new strings in the hash table only if the match length
         * is not too large. This saves time but degrades compression.
         */
        if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH$1) {
          s.match_length--; /* string at strstart already in table */
          do {
            s.strstart++;
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH$1 - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
            /***/
            /* strstart never exceeds WSIZE-MAX_MATCH, so there are
             * always MIN_MATCH bytes ahead.
             */
          } while (--s.match_length !== 0);
          s.strstart++;
        } else
        {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

  //#if MIN_MATCH != 3
  //                Call UPDATE_HASH() MIN_MATCH-3 more times
  //#endif
          /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
           * matter since it will be recomputed at next deflate call.
           */
        }
      } else {
        /* No match, output a literal byte */
        //Tracevv((stderr,"%c", s.window[s.strstart]));
        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
        bflush = _tr_tally$1(s, 0, s.window[s.strstart]);

        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }
    s.insert = ((s.strstart < (MIN_MATCH$1 - 1)) ? s.strstart : MIN_MATCH$1 - 1);
    if (flush === Z_FINISH) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
    return BS_BLOCK_DONE;
  };

  /* ===========================================================================
   * Same as above, but achieves better compression. We use a lazy
   * evaluation for matches: a match is finally adopted only if there is
   * no better match at the next window position.
   */
  const deflate_slow = (s, flush) => {

    let hash_head;          /* head of hash chain */
    let bflush;              /* set if current block must be flushed */

    let max_insert;

    /* Process the input block. */
    for (;;) {
      /* Make sure that we always have enough lookahead, except
       * at the end of the input file. We need MAX_MATCH bytes
       * for the next match, plus MIN_MATCH bytes to insert the
       * string following the next match.
       */
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) { break; } /* flush the current block */
      }

      /* Insert the string window[strstart .. strstart+2] in the
       * dictionary, and set hash_head to the head of the hash chain:
       */
      hash_head = 0/*NIL*/;
      if (s.lookahead >= MIN_MATCH$1) {
        /*** INSERT_STRING(s, s.strstart, hash_head); ***/
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH$1 - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
        /***/
      }

      /* Find the longest match, discarding those <= prev_length.
       */
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH$1 - 1;

      if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
          s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
        /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
        s.match_length = longest_match(s, hash_head);
        /* longest_match() sets match_start */

        if (s.match_length <= 5 &&
           (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH$1 && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

          /* If prev_match is also MIN_MATCH, match_start is garbage
           * but we will ignore the current match anyway.
           */
          s.match_length = MIN_MATCH$1 - 1;
        }
      }
      /* If there was a match at the previous step and the current
       * match is not better, output the previous match:
       */
      if (s.prev_length >= MIN_MATCH$1 && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH$1;
        /* Do not insert strings in hash table beyond this. */

        //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

        /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                       s.prev_length - MIN_MATCH, bflush);***/
        bflush = _tr_tally$1(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH$1);
        /* Insert in hash table all strings up to the end of the match.
         * strstart-1 and strstart are already inserted. If there is not
         * enough lookahead, the last two strings are not inserted in
         * the hash table.
         */
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH$1 - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
            /***/
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH$1 - 1;
        s.strstart++;

        if (bflush) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }

      } else if (s.match_available) {
        /* If there was no match at the previous position, output a
         * single literal. If there was a match but the current match
         * is longer, truncate the previous match to a single literal.
         */
        //Tracevv((stderr,"%c", s->window[s->strstart-1]));
        /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
        bflush = _tr_tally$1(s, 0, s.window[s.strstart - 1]);

        if (bflush) {
          /*** FLUSH_BLOCK_ONLY(s, 0) ***/
          flush_block_only(s, false);
          /***/
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        /* There is no previous match to compare with, wait for
         * the next step to decide.
         */
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    //Assert (flush != Z_NO_FLUSH, "no flush?");
    if (s.match_available) {
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally$1(s, 0, s.window[s.strstart - 1]);

      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH$1 - 1 ? s.strstart : MIN_MATCH$1 - 1;
    if (flush === Z_FINISH) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }

    return BS_BLOCK_DONE;
  };


  /* ===========================================================================
   * For Z_RLE, simply look for runs of bytes, generate matches only of distance
   * one.  Do not maintain a hash table.  (It will be regenerated if this run of
   * deflate switches away from Z_RLE.)
   */
  const deflate_rle = (s, flush) => {

    let bflush;            /* set if current block must be flushed */
    let prev;              /* byte at distance one to match */
    let scan, strend;      /* scan goes up to strend for length of run */

    const _win = s.window;

    for (;;) {
      /* Make sure that we always have enough lookahead, except
       * at the end of the input file. We need MAX_MATCH bytes
       * for the longest run, plus one for the unrolled loop.
       */
      if (s.lookahead <= MAX_MATCH$1) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH$1 && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) { break; } /* flush the current block */
      }

      /* See how many times the previous byte repeats */
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH$1 && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH$1;
          do {
            /*jshint noempty:false*/
          } while (prev === _win[++scan] && prev === _win[++scan] &&
                   prev === _win[++scan] && prev === _win[++scan] &&
                   prev === _win[++scan] && prev === _win[++scan] &&
                   prev === _win[++scan] && prev === _win[++scan] &&
                   scan < strend);
          s.match_length = MAX_MATCH$1 - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
        //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
      }

      /* Emit match if have run of MIN_MATCH or longer, else emit literal */
      if (s.match_length >= MIN_MATCH$1) {
        //check_match(s, s.strstart, s.strstart - 1, s.match_length);

        /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
        bflush = _tr_tally$1(s, 1, s.match_length - MIN_MATCH$1);

        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        /* No match, output a literal byte */
        //Tracevv((stderr,"%c", s->window[s->strstart]));
        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
        bflush = _tr_tally$1(s, 0, s.window[s.strstart]);

        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
    return BS_BLOCK_DONE;
  };

  /* ===========================================================================
   * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
   * (It will be regenerated if this run of deflate switches away from Huffman.)
   */
  const deflate_huff = (s, flush) => {

    let bflush;             /* set if current block must be flushed */

    for (;;) {
      /* Make sure that we have a literal to write. */
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          break;      /* flush the current block */
        }
      }

      /* Output a literal byte */
      s.match_length = 0;
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally$1(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
    return BS_BLOCK_DONE;
  };

  /* Values for max_lazy_match, good_match and max_chain_length, depending on
   * the desired pack level (0..9). The values given below have been tuned to
   * exclude worst case performance for pathological files. Better values may be
   * found for specific files.
   */
  function Config(good_length, max_lazy, nice_length, max_chain, func) {

    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }

  const configuration_table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

    new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
  ];


  /* ===========================================================================
   * Initialize the "longest match" routines for a new zlib stream
   */
  const lm_init = (s) => {

    s.window_size = 2 * s.w_size;

    /*** CLEAR_HASH(s); ***/
    zero$1(s.head); // Fill with NIL (= 0);

    /* Set the default configuration parameters:
     */
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;

    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH$1 - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };


  function DeflateState() {
    this.strm = null;            /* pointer back to this zlib stream */
    this.status = 0;            /* as the name implies */
    this.pending_buf = null;      /* output still pending */
    this.pending_buf_size = 0;  /* size of pending_buf */
    this.pending_out = 0;       /* next pending byte to output to the stream */
    this.pending = 0;           /* nb of bytes in the pending buffer */
    this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
    this.gzhead = null;         /* gzip header information to write */
    this.gzindex = 0;           /* where in extra, name, or comment */
    this.method = Z_DEFLATED; /* can only be DEFLATED */
    this.last_flush = -1;   /* value of flush param for previous deflate call */

    this.w_size = 0;  /* LZ77 window size (32K by default) */
    this.w_bits = 0;  /* log2(w_size)  (8..16) */
    this.w_mask = 0;  /* w_size - 1 */

    this.window = null;
    /* Sliding window. Input bytes are read into the second half of the window,
     * and move to the first half later to keep a dictionary of at least wSize
     * bytes. With this organization, matches are limited to a distance of
     * wSize-MAX_MATCH bytes, but this ensures that IO is always
     * performed with a length multiple of the block size.
     */

    this.window_size = 0;
    /* Actual size of window: 2*wSize, except when the user input buffer
     * is directly used as sliding window.
     */

    this.prev = null;
    /* Link to older string with same hash index. To limit the size of this
     * array to 64K, this link is maintained only for the last 32K strings.
     * An index in this array is thus a window index modulo 32K.
     */

    this.head = null;   /* Heads of the hash chains or NIL. */

    this.ins_h = 0;       /* hash index of string to be inserted */
    this.hash_size = 0;   /* number of elements in hash table */
    this.hash_bits = 0;   /* log2(hash_size) */
    this.hash_mask = 0;   /* hash_size-1 */

    this.hash_shift = 0;
    /* Number of bits by which ins_h must be shifted at each input
     * step. It must be such that after MIN_MATCH steps, the oldest
     * byte no longer takes part in the hash key, that is:
     *   hash_shift * MIN_MATCH >= hash_bits
     */

    this.block_start = 0;
    /* Window position at the beginning of the current output block. Gets
     * negative when the window is moved backwards.
     */

    this.match_length = 0;      /* length of best match */
    this.prev_match = 0;        /* previous match */
    this.match_available = 0;   /* set if previous match exists */
    this.strstart = 0;          /* start of string to insert */
    this.match_start = 0;       /* start of matching string */
    this.lookahead = 0;         /* number of valid bytes ahead in window */

    this.prev_length = 0;
    /* Length of the best match at previous step. Matches not greater than this
     * are discarded. This is used in the lazy match evaluation.
     */

    this.max_chain_length = 0;
    /* To speed up deflation, hash chains are never searched beyond this
     * length.  A higher limit improves compression ratio but degrades the
     * speed.
     */

    this.max_lazy_match = 0;
    /* Attempt to find a better match only when the current match is strictly
     * smaller than this value. This mechanism is used only for compression
     * levels >= 4.
     */
    // That's alias to max_lazy_match, don't use directly
    //this.max_insert_length = 0;
    /* Insert new strings in the hash table only if the match length is not
     * greater than this length. This saves time but degrades compression.
     * max_insert_length is used only for compression levels <= 3.
     */

    this.level = 0;     /* compression level (1..9) */
    this.strategy = 0;  /* favor or force Huffman coding*/

    this.good_match = 0;
    /* Use a faster search when the previous match is longer than this */

    this.nice_match = 0; /* Stop searching when current match exceeds this */

                /* used by trees.c: */

    /* Didn't use ct_data typedef below to suppress compiler warning */

    // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
    // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
    // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

    // Use flat array of DOUBLE size, with interleaved fata,
    // because JS does not support effective
    this.dyn_ltree  = new Uint16Array(HEAP_SIZE$1 * 2);
    this.dyn_dtree  = new Uint16Array((2 * D_CODES$1 + 1) * 2);
    this.bl_tree    = new Uint16Array((2 * BL_CODES$1 + 1) * 2);
    zero$1(this.dyn_ltree);
    zero$1(this.dyn_dtree);
    zero$1(this.bl_tree);

    this.l_desc   = null;         /* desc. for literal tree */
    this.d_desc   = null;         /* desc. for distance tree */
    this.bl_desc  = null;         /* desc. for bit length tree */

    //ush bl_count[MAX_BITS+1];
    this.bl_count = new Uint16Array(MAX_BITS$1 + 1);
    /* number of codes at each bit length for an optimal tree */

    //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
    this.heap = new Uint16Array(2 * L_CODES$1 + 1);  /* heap used to build the Huffman trees */
    zero$1(this.heap);

    this.heap_len = 0;               /* number of elements in the heap */
    this.heap_max = 0;               /* element of largest frequency */
    /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
     * The same heap array is used to build all trees.
     */

    this.depth = new Uint16Array(2 * L_CODES$1 + 1); //uch depth[2*L_CODES+1];
    zero$1(this.depth);
    /* Depth of each subtree used as tie breaker for trees of equal frequency
     */

    this.l_buf = 0;          /* buffer index for literals or lengths */

    this.lit_bufsize = 0;
    /* Size of match buffer for literals/lengths.  There are 4 reasons for
     * limiting lit_bufsize to 64K:
     *   - frequencies can be kept in 16 bit counters
     *   - if compression is not successful for the first block, all input
     *     data is still in the window so we can still emit a stored block even
     *     when input comes from standard input.  (This can also be done for
     *     all blocks if lit_bufsize is not greater than 32K.)
     *   - if compression is not successful for a file smaller than 64K, we can
     *     even emit a stored file instead of a stored block (saving 5 bytes).
     *     This is applicable only for zip (not gzip or zlib).
     *   - creating new Huffman trees less frequently may not provide fast
     *     adaptation to changes in the input data statistics. (Take for
     *     example a binary file with poorly compressible code followed by
     *     a highly compressible string table.) Smaller buffer sizes give
     *     fast adaptation but have of course the overhead of transmitting
     *     trees more frequently.
     *   - I can't count above 4
     */

    this.last_lit = 0;      /* running index in l_buf */

    this.d_buf = 0;
    /* Buffer index for distances. To simplify the code, d_buf and l_buf have
     * the same number of elements. To use different lengths, an extra flag
     * array would be necessary.
     */

    this.opt_len = 0;       /* bit length of current block with optimal trees */
    this.static_len = 0;    /* bit length of current block with static trees */
    this.matches = 0;       /* number of string matches in current block */
    this.insert = 0;        /* bytes at end of window left to insert */


    this.bi_buf = 0;
    /* Output buffer. bits are inserted starting at the bottom (least
     * significant bits).
     */
    this.bi_valid = 0;
    /* Number of valid bits in bi_buf.  All bits above the last valid bit
     * are always zero.
     */

    // Used for window memory init. We safely ignore it for JS. That makes
    // sense only for pointers and memory check tools.
    //this.high_water = 0;
    /* High water mark offset in window for initialized bytes -- bytes above
     * this are set to zero in order to avoid memory check warnings when
     * longest match routines access bytes past the input.  This is then
     * updated to the new high water mark.
     */
  }


  const deflateResetKeep = (strm) => {

    if (!strm || !strm.state) {
      return err(strm, Z_STREAM_ERROR);
    }

    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN$1;

    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;

    if (s.wrap < 0) {
      s.wrap = -s.wrap;
      /* was made negative by deflate(..., Z_FINISH); */
    }
    s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
    strm.adler = (s.wrap === 2) ?
      0  // crc32(0, Z_NULL, 0)
    :
      1; // adler32(0, Z_NULL, 0)
    s.last_flush = Z_NO_FLUSH;
    _tr_init$1(s);
    return Z_OK;
  };


  const deflateReset = (strm) => {

    const ret = deflateResetKeep(strm);
    if (ret === Z_OK) {
      lm_init(strm.state);
    }
    return ret;
  };


  const deflateSetHeader = (strm, head) => {

    if (!strm || !strm.state) { return Z_STREAM_ERROR; }
    if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
    strm.state.gzhead = head;
    return Z_OK;
  };


  const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

    if (!strm) { // === Z_NULL
      return Z_STREAM_ERROR;
    }
    let wrap = 1;

    if (level === Z_DEFAULT_COMPRESSION) {
      level = 6;
    }

    if (windowBits < 0) { /* suppress zlib wrapper */
      wrap = 0;
      windowBits = -windowBits;
    }

    else if (windowBits > 15) {
      wrap = 2;           /* write gzip wrapper instead */
      windowBits -= 16;
    }


    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
      windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
      strategy < 0 || strategy > Z_FIXED$1) {
      return err(strm, Z_STREAM_ERROR);
    }


    if (windowBits === 8) {
      windowBits = 9;
    }
    /* until 256-byte window bug fixed */

    const s = new DeflateState();

    strm.state = s;
    s.strm = strm;

    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;

    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH$1 - 1) / MIN_MATCH$1);

    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);

    // Don't need mem init magic for JS.
    //s.high_water = 0;  /* nothing written to s->window yet */

    s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

    s.pending_buf_size = s.lit_bufsize * 4;

    //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
    //s->pending_buf = (uchf *) overlay;
    s.pending_buf = new Uint8Array(s.pending_buf_size);

    // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
    //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
    s.d_buf = 1 * s.lit_bufsize;

    //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
    s.l_buf = (1 + 2) * s.lit_bufsize;

    s.level = level;
    s.strategy = strategy;
    s.method = method;

    return deflateReset(strm);
  };

  const deflateInit = (strm, level) => {

    return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
  };


  const deflate = (strm, flush) => {

    let beg, val; // for gzip header write only

    if (!strm || !strm.state ||
      flush > Z_BLOCK || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
    }

    const s = strm.state;

    if (!strm.output ||
        (!strm.input && strm.avail_in !== 0) ||
        (s.status === FINISH_STATE && flush !== Z_FINISH)) {
      return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
    }

    s.strm = strm; /* just in case */
    const old_flush = s.last_flush;
    s.last_flush = flush;

    /* Write the header */
    if (s.status === INIT_STATE) {

      if (s.wrap === 2) { // GZIP header
        strm.adler = 0;  //crc32(0L, Z_NULL, 0);
        put_byte(s, 31);
        put_byte(s, 139);
        put_byte(s, 8);
        if (!s.gzhead) { // s->gzhead == Z_NULL
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, s.level === 9 ? 2 :
                      (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                       4 : 0));
          put_byte(s, OS_CODE);
          s.status = BUSY_STATE;
        }
        else {
          put_byte(s, (s.gzhead.text ? 1 : 0) +
                      (s.gzhead.hcrc ? 2 : 0) +
                      (!s.gzhead.extra ? 0 : 4) +
                      (!s.gzhead.name ? 0 : 8) +
                      (!s.gzhead.comment ? 0 : 16)
          );
          put_byte(s, s.gzhead.time & 0xff);
          put_byte(s, (s.gzhead.time >> 8) & 0xff);
          put_byte(s, (s.gzhead.time >> 16) & 0xff);
          put_byte(s, (s.gzhead.time >> 24) & 0xff);
          put_byte(s, s.level === 9 ? 2 :
                      (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                       4 : 0));
          put_byte(s, s.gzhead.os & 0xff);
          if (s.gzhead.extra && s.gzhead.extra.length) {
            put_byte(s, s.gzhead.extra.length & 0xff);
            put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
          }
          if (s.gzhead.hcrc) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
          }
          s.gzindex = 0;
          s.status = EXTRA_STATE;
        }
      }
      else // DEFLATE header
      {
        let header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
        let level_flags = -1;

        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= (level_flags << 6);
        if (s.strstart !== 0) { header |= PRESET_DICT; }
        header += 31 - (header % 31);

        s.status = BUSY_STATE;
        putShortMSB(s, header);

        /* Save the adler32 of the preset dictionary: */
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 0xffff);
        }
        strm.adler = 1; // adler32(0L, Z_NULL, 0);
      }
    }

  //#ifdef GZIP
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra/* != Z_NULL*/) {
        beg = s.pending;  /* start of bytes to update crc */

        while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              break;
            }
          }
          put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
          s.gzindex++;
        }
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (s.gzindex === s.gzhead.extra.length) {
          s.gzindex = 0;
          s.status = NAME_STATE;
        }
      }
      else {
        s.status = NAME_STATE;
      }
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name/* != Z_NULL*/) {
        beg = s.pending;  /* start of bytes to update crc */
        //int val;

        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          // JS specific: little magic to add zero terminator to end of string
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.gzindex = 0;
          s.status = COMMENT_STATE;
        }
      }
      else {
        s.status = COMMENT_STATE;
      }
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment/* != Z_NULL*/) {
        beg = s.pending;  /* start of bytes to update crc */
        //int val;

        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          // JS specific: little magic to add zero terminator to end of string
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.status = HCRC_STATE;
        }
      }
      else {
        s.status = HCRC_STATE;
      }
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
        }
        if (s.pending + 2 <= s.pending_buf_size) {
          put_byte(s, strm.adler & 0xff);
          put_byte(s, (strm.adler >> 8) & 0xff);
          strm.adler = 0; //crc32(0L, Z_NULL, 0);
          s.status = BUSY_STATE;
        }
      }
      else {
        s.status = BUSY_STATE;
      }
    }
  //#endif

    /* Flush as much pending output as possible */
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        /* Since avail_out is 0, deflate will be called again with
         * more output space, but possibly with both pending and
         * avail_in equal to zero. There won't be anything to do,
         * but this is not an error situation so make sure we
         * return OK instead of BUF_ERROR at next call of deflate:
         */
        s.last_flush = -1;
        return Z_OK;
      }

      /* Make sure there is something to do and avoid duplicate consecutive
       * flushes. For repeated and useless calls with Z_FINISH, we keep
       * returning Z_STREAM_END instead of Z_BUF_ERROR.
       */
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
      flush !== Z_FINISH) {
      return err(strm, Z_BUF_ERROR);
    }

    /* User must not provide more input after the first FINISH: */
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR);
    }

    /* Start a new block or continue the current one.
     */
    if (strm.avail_in !== 0 || s.lookahead !== 0 ||
      (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
      let bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
        (s.strategy === Z_RLE ? deflate_rle(s, flush) :
          configuration_table[s.level].func(s, flush));

      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          /* avoid BUF_ERROR next call, see above */
        }
        return Z_OK;
        /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
         * of deflate should use the same flush parameter to make sure
         * that the flush is complete. So we don't have to output an
         * empty block here, this will be done at next call. This also
         * ensures that for a very small output buffer, we emit at most
         * one empty block.
         */
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align$1(s);
        }
        else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

          _tr_stored_block$1(s, 0, 0, false);
          /* For a full flush, this empty block will be recognized
           * as a special marker by inflate_sync().
           */
          if (flush === Z_FULL_FLUSH) {
            /*** CLEAR_HASH(s); ***/             /* forget history */
            zero$1(s.head); // Fill with NIL (= 0);

            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
          return Z_OK;
        }
      }
    }
    //Assert(strm->avail_out > 0, "bug2");
    //if (strm.avail_out <= 0) { throw new Error("bug2");}

    if (flush !== Z_FINISH) { return Z_OK; }
    if (s.wrap <= 0) { return Z_STREAM_END; }

    /* Write the trailer */
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      put_byte(s, (strm.adler >> 16) & 0xff);
      put_byte(s, (strm.adler >> 24) & 0xff);
      put_byte(s, strm.total_in & 0xff);
      put_byte(s, (strm.total_in >> 8) & 0xff);
      put_byte(s, (strm.total_in >> 16) & 0xff);
      put_byte(s, (strm.total_in >> 24) & 0xff);
    }
    else
    {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }

    flush_pending(strm);
    /* If avail_out is zero, the application will call deflate again
     * to flush the rest.
     */
    if (s.wrap > 0) { s.wrap = -s.wrap; }
    /* write the trailer only once! */
    return s.pending !== 0 ? Z_OK : Z_STREAM_END;
  };


  const deflateEnd = (strm) => {

    if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
      return Z_STREAM_ERROR;
    }

    const status = strm.state.status;
    if (status !== INIT_STATE &&
      status !== EXTRA_STATE &&
      status !== NAME_STATE &&
      status !== COMMENT_STATE &&
      status !== HCRC_STATE &&
      status !== BUSY_STATE &&
      status !== FINISH_STATE
    ) {
      return err(strm, Z_STREAM_ERROR);
    }

    strm.state = null;

    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
  };


  /* =========================================================================
   * Initializes the compression dictionary from the given byte
   * sequence without producing any compressed output.
   */
  const deflateSetDictionary = (strm, dictionary) => {

    let dictLength = dictionary.length;

    if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
      return Z_STREAM_ERROR;
    }

    const s = strm.state;
    const wrap = s.wrap;

    if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
      return Z_STREAM_ERROR;
    }

    /* when using zlib wrappers, compute Adler-32 for provided dictionary */
    if (wrap === 1) {
      /* adler32(strm->adler, dictionary, dictLength); */
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }

    s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

    /* if dictionary would fill window, just replace the history */
    if (dictLength >= s.w_size) {
      if (wrap === 0) {            /* already empty otherwise */
        /*** CLEAR_HASH(s); ***/
        zero$1(s.head); // Fill with NIL (= 0);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      /* use the tail */
      // dictionary = dictionary.slice(dictLength - s.w_size);
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    /* insert dictionary into window and hash */
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH$1) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH$1 - 1);
      do {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH$1 - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];

        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH$1 - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH$1 - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK;
  };


  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2 = deflate;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = 'pako deflate (from Nodeca project)';

  /* Not implemented
  module.exports.deflateBound = deflateBound;
  module.exports.deflateCopy = deflateCopy;
  module.exports.deflateParams = deflateParams;
  module.exports.deflatePending = deflatePending;
  module.exports.deflatePrime = deflatePrime;
  module.exports.deflateTune = deflateTune;
  */

  var deflate_1 = {
  	deflateInit: deflateInit_1,
  	deflateInit2: deflateInit2_1,
  	deflateReset: deflateReset_1,
  	deflateResetKeep: deflateResetKeep_1,
  	deflateSetHeader: deflateSetHeader_1,
  	deflate: deflate_2,
  	deflateEnd: deflateEnd_1,
  	deflateSetDictionary: deflateSetDictionary_1,
  	deflateInfo: deflateInfo
  };

  const _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var assign = function (obj /*from1, from2, from3, ...*/) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) { continue; }

      if (typeof source !== 'object') {
        throw new TypeError(source + 'must be non-object');
      }

      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }

    return obj;
  };


  // Join array of chunks to single array.
  var flattenChunks = (chunks) => {
    // calculate data length
    let len = 0;

    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    const result = new Uint8Array(len);

    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  };

  var common = {
  	assign: assign,
  	flattenChunks: flattenChunks
  };

  // String encode/decode helpers


  // Quick check if we can use fast array to bin string conversion
  //
  // - apply(Array) can fail on Android 2.2
  // - apply(Uint8Array) can fail on iOS 5.1 Safari
  //
  let STR_APPLY_UIA_OK = true;

  try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


  // Table with utf8 lengths (calculated by first byte of sequence)
  // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
  // because max possible codepoint is 0x10ffff
  const _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
  }
  _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


  // convert string to array (typed, when possible)
  var string2buf = (str) => {
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

    // count binary size
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }

    // allocate buffer
    buf = new Uint8Array(buf_len);

    // convert
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      if (c < 0x80) {
        /* one byte */
        buf[i++] = c;
      } else if (c < 0x800) {
        /* two bytes */
        buf[i++] = 0xC0 | (c >>> 6);
        buf[i++] = 0x80 | (c & 0x3f);
      } else if (c < 0x10000) {
        /* three bytes */
        buf[i++] = 0xE0 | (c >>> 12);
        buf[i++] = 0x80 | (c >>> 6 & 0x3f);
        buf[i++] = 0x80 | (c & 0x3f);
      } else {
        /* four bytes */
        buf[i++] = 0xf0 | (c >>> 18);
        buf[i++] = 0x80 | (c >>> 12 & 0x3f);
        buf[i++] = 0x80 | (c >>> 6 & 0x3f);
        buf[i++] = 0x80 | (c & 0x3f);
      }
    }

    return buf;
  };

  // Helper
  const buf2binstring = (buf, len) => {
    // On Chrome, the arguments in a function call that are allowed is `65534`.
    // If the length of the buffer is smaller than that, we can use this optimization,
    // otherwise we will take a slower path.
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }

    let result = '';
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };


  // convert array to string
  var buf2string = (buf, max) => {
    let i, out;
    const len = max || buf.length;

    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    const utf16buf = new Array(len * 2);

    for (out = 0, i = 0; i < len;) {
      let c = buf[i++];
      // quick process ascii
      if (c < 0x80) { utf16buf[out++] = c; continue; }

      let c_len = _utf8len[c];
      // skip 5 & 6 byte codes
      if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

      // apply mask on first byte
      c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
      // join the rest
      while (c_len > 1 && i < len) {
        c = (c << 6) | (buf[i++] & 0x3f);
        c_len--;
      }

      // terminated by end of string?
      if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

      if (c < 0x10000) {
        utf16buf[out++] = c;
      } else {
        c -= 0x10000;
        utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
        utf16buf[out++] = 0xdc00 | (c & 0x3ff);
      }
    }

    return buf2binstring(utf16buf, out);
  };


  // Calculate max possible position in utf8 buffer,
  // that will not break sequence. If that's not possible
  // - (very small limits) return max size as is.
  //
  // buf[] - utf8 bytes array
  // max   - length limit (mandatory);
  var utf8border = (buf, max) => {

    max = max || buf.length;
    if (max > buf.length) { max = buf.length; }

    // go back from last position, until start of sequence found
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

    // Very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) { return max; }

    // If we came to start of buffer - that means buffer is too small,
    // return max too.
    if (pos === 0) { return max; }

    return (pos + _utf8len[buf[pos]] > max) ? pos : max;
  };

  var strings = {
  	string2buf: string2buf,
  	buf2string: buf2string,
  	utf8border: utf8border
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  function ZStream() {
    /* next input byte */
    this.input = null; // JS specific, because we have no pointers
    this.next_in = 0;
    /* number of bytes available at input */
    this.avail_in = 0;
    /* total number of input bytes read so far */
    this.total_in = 0;
    /* next output byte should be put there */
    this.output = null; // JS specific, because we have no pointers
    this.next_out = 0;
    /* remaining free space at output */
    this.avail_out = 0;
    /* total number of bytes output so far */
    this.total_out = 0;
    /* last error message, NULL if no error */
    this.msg = ''/*Z_NULL*/;
    /* not visible by applications */
    this.state = null;
    /* best guess about the data type: binary or text */
    this.data_type = 2/*Z_UNKNOWN*/;
    /* adler32 value of the uncompressed data */
    this.adler = 0;
  }

  var zstream = ZStream;

  const toString$1 = Object.prototype.toString;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  const {
    Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$1,
    Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1,
    Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
    Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
    Z_DEFLATED: Z_DEFLATED$1
  } = constants;

  /* ===========================================================================*/


  /**
   * class Deflate
   *
   * Generic JS-style wrapper for zlib calls. If you don't need
   * streaming behaviour - use more simple functions: [[deflate]],
   * [[deflateRaw]] and [[gzip]].
   **/

  /* internal
   * Deflate.chunks -> Array
   *
   * Chunks of output data, if [[Deflate#onData]] not overridden.
   **/

  /**
   * Deflate.result -> Uint8Array
   *
   * Compressed result, generated by default [[Deflate#onData]]
   * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
   * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
   **/

  /**
   * Deflate.err -> Number
   *
   * Error code after deflate finished. 0 (Z_OK) on success.
   * You will not need it in real life, because deflate errors
   * are possible only on wrong options or bad `onData` / `onEnd`
   * custom handlers.
   **/

  /**
   * Deflate.msg -> String
   *
   * Error message, if [[Deflate.err]] != 0
   **/


  /**
   * new Deflate(options)
   * - options (Object): zlib deflate options.
   *
   * Creates new deflator instance with specified params. Throws exception
   * on bad params. Supported options:
   *
   * - `level`
   * - `windowBits`
   * - `memLevel`
   * - `strategy`
   * - `dictionary`
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information on these.
   *
   * Additional options, for internal needs:
   *
   * - `chunkSize` - size of generated data chunks (16K by default)
   * - `raw` (Boolean) - do raw deflate
   * - `gzip` (Boolean) - create gzip wrapper
   * - `header` (Object) - custom header for gzip
   *   - `text` (Boolean) - true if compressed data believed to be text
   *   - `time` (Number) - modification time, unix timestamp
   *   - `os` (Number) - operation system code
   *   - `extra` (Array) - array of bytes with extra data (max 65536)
   *   - `name` (String) - file name (binary string)
   *   - `comment` (String) - comment (binary string)
   *   - `hcrc` (Boolean) - true if header crc should be added
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako')
   *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
   *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
   *
   * const deflate = new pako.Deflate({ level: 3});
   *
   * deflate.push(chunk1, false);
   * deflate.push(chunk2, true);  // true -> last chunk
   *
   * if (deflate.err) { throw new Error(deflate.err); }
   *
   * console.log(deflate.result);
   * ```
   **/
  function Deflate(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION$1,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY$1
    }, options || {});

    let opt = this.options;

    if (opt.raw && (opt.windowBits > 0)) {
      opt.windowBits = -opt.windowBits;
    }

    else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
      opt.windowBits += 16;
    }

    this.err    = 0;      // error code, if happens (0 = Z_OK)
    this.msg    = '';     // error message
    this.ended  = false;  // used to avoid multiple onEnd() calls
    this.chunks = [];     // chunks of compressed data

    this.strm = new zstream();
    this.strm.avail_out = 0;

    let status = deflate_1.deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );

    if (status !== Z_OK$1) {
      throw new Error(messages[status]);
    }

    if (opt.header) {
      deflate_1.deflateSetHeader(this.strm, opt.header);
    }

    if (opt.dictionary) {
      let dict;
      // Convert data if needed
      if (typeof opt.dictionary === 'string') {
        // If we need to compress text, change encoding to utf8.
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }

      status = deflate_1.deflateSetDictionary(this.strm, dict);

      if (status !== Z_OK$1) {
        throw new Error(messages[status]);
      }

      this._dict_set = true;
    }
  }

  /**
   * Deflate#push(data[, flush_mode]) -> Boolean
   * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
   *   converted to utf8 byte sequence.
   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
   *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
   *
   * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
   * new compressed chunks. Returns `true` on success. The last data block must
   * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
   * buffers and call [[Deflate#onEnd]].
   *
   * On fail call [[Deflate#onEnd]] with error code and return false.
   *
   * ##### Example
   *
   * ```javascript
   * push(chunk, false); // push one of data chunks
   * ...
   * push(chunk, true);  // push last chunk
   * ```
   **/
  Deflate.prototype.push = function (data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;

    if (this.ended) { return false; }

    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH$1 : Z_NO_FLUSH$1;

    // Convert data if needed
    if (typeof data === 'string') {
      // If we need to compress text, change encoding to utf8.
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }

    strm.next_in = 0;
    strm.avail_in = strm.input.length;

    for (;;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }

      // Make sure avail_out > 6 to avoid repeating markers
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH$1) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }

      status = deflate_1.deflate(strm, _flush_mode);

      // Ended => flush and finish
      if (status === Z_STREAM_END$1) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$1;
      }

      // Flush if out buffer full
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }

      // Flush if requested and has data
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }

      if (strm.avail_in === 0) break;
    }

    return true;
  };


  /**
   * Deflate#onData(chunk) -> Void
   * - chunk (Uint8Array): output data.
   *
   * By default, stores data blocks in `chunks[]` property and glue
   * those in `onEnd`. Override this handler, if you need another behaviour.
   **/
  Deflate.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
  };


  /**
   * Deflate#onEnd(status) -> Void
   * - status (Number): deflate status. 0 (Z_OK) on success,
   *   other if not.
   *
   * Called once after you tell deflate that the input stream is
   * complete (Z_FINISH). By default - join collected chunks,
   * free memory and fill `results` / `err` properties.
   **/
  Deflate.prototype.onEnd = function (status) {
    // On success - join
    if (status === Z_OK$1) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  // See state defs from inflate.js
  const BAD = 30;       /* got a data error -- remain here until reset */
  const TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

  /*
     Decode literal, length, and distance codes and write out the resulting
     literal and match bytes until either not enough input or output is
     available, an end-of-block is encountered, or a data error is encountered.
     When large enough input and output buffers are supplied to inflate(), for
     example, a 16K input buffer and a 64K output buffer, more than 95% of the
     inflate execution time is spent in this routine.

     Entry assumptions:

          state.mode === LEN
          strm.avail_in >= 6
          strm.avail_out >= 258
          start >= strm.avail_out
          state.bits < 8

     On return, state.mode is one of:

          LEN -- ran out of enough output space or enough available input
          TYPE -- reached end of block code, inflate() to interpret next block
          BAD -- error in block data

     Notes:

      - The maximum input bits used by a length/distance pair is 15 bits for the
        length code, 5 bits for the length extra, 15 bits for the distance code,
        and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
        Therefore if strm.avail_in >= 6, then there is enough input to avoid
        checking for available input while decoding.

      - The maximum bytes that a single length/distance pair can output is 258
        bytes, which is the maximum length that can be coded.  inflate_fast()
        requires strm.avail_out >= 258 for each loop to avoid checking for
        output space.
   */
  var inffast = function inflate_fast(strm, start) {
    let _in;                    /* local strm.input */
    let last;                   /* have enough input while in < last */
    let _out;                   /* local strm.output */
    let beg;                    /* inflate()'s initial strm.output */
    let end;                    /* while out < end, enough space available */
  //#ifdef INFLATE_STRICT
    let dmax;                   /* maximum distance from zlib header */
  //#endif
    let wsize;                  /* window size or zero if not using window */
    let whave;                  /* valid bytes in the window */
    let wnext;                  /* window write index */
    // Use `s_window` instead `window`, avoid conflict with instrumentation tools
    let s_window;               /* allocated sliding window, if wsize != 0 */
    let hold;                   /* local strm.hold */
    let bits;                   /* local strm.bits */
    let lcode;                  /* local strm.lencode */
    let dcode;                  /* local strm.distcode */
    let lmask;                  /* mask for first level of length codes */
    let dmask;                  /* mask for first level of distance codes */
    let here;                   /* retrieved table entry */
    let op;                     /* code bits, operation, extra bits, or */
                                /*  window position, window bytes to copy */
    let len;                    /* match length, unused bytes */
    let dist;                   /* match distance */
    let from;                   /* where to copy match from */
    let from_source;


    let input, output; // JS specific, because we have no pointers

    /* copy state to local variables */
    const state = strm.state;
    //here = state.here;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
  //#ifdef INFLATE_STRICT
    dmax = state.dmax;
  //#endif
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;


    /* decode literals and length/distances until end-of-block or not enough
       input data or output space */

    top:
    do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }

      here = lcode[hold & lmask];

      dolen:
      for (;;) { // Goto emulation
        op = here >>> 24/*here.bits*/;
        hold >>>= op;
        bits -= op;
        op = (here >>> 16) & 0xff/*here.op*/;
        if (op === 0) {                          /* literal */
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          output[_out++] = here & 0xffff/*here.val*/;
        }
        else if (op & 16) {                     /* length base */
          len = here & 0xffff/*here.val*/;
          op &= 15;                           /* number of extra bits */
          if (op) {
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
            }
            len += hold & ((1 << op) - 1);
            hold >>>= op;
            bits -= op;
          }
          //Tracevv((stderr, "inflate:         length %u\n", len));
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = dcode[hold & dmask];

          dodist:
          for (;;) { // goto emulation
            op = here >>> 24/*here.bits*/;
            hold >>>= op;
            bits -= op;
            op = (here >>> 16) & 0xff/*here.op*/;

            if (op & 16) {                      /* distance base */
              dist = here & 0xffff/*here.val*/;
              op &= 15;                       /* number of extra bits */
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
              }
              dist += hold & ((1 << op) - 1);
  //#ifdef INFLATE_STRICT
              if (dist > dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD;
                break top;
              }
  //#endif
              hold >>>= op;
              bits -= op;
              //Tracevv((stderr, "inflate:         distance %u\n", dist));
              op = _out - beg;                /* max distance in output */
              if (dist > op) {                /* see if copy from window */
                op = dist - op;               /* distance back in window */
                if (op > whave) {
                  if (state.sane) {
                    strm.msg = 'invalid distance too far back';
                    state.mode = BAD;
                    break top;
                  }

  // (!) This block is disabled in zlib defaults,
  // don't enable it for binary compatibility
  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
  //                if (len <= op - whave) {
  //                  do {
  //                    output[_out++] = 0;
  //                  } while (--len);
  //                  continue top;
  //                }
  //                len -= op - whave;
  //                do {
  //                  output[_out++] = 0;
  //                } while (--op > whave);
  //                if (op === 0) {
  //                  from = _out - dist;
  //                  do {
  //                    output[_out++] = output[from++];
  //                  } while (--len);
  //                  continue top;
  //                }
  //#endif
                }
                from = 0; // window index
                from_source = s_window;
                if (wnext === 0) {           /* very common case */
                  from += wsize - op;
                  if (op < len) {         /* some from window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;  /* rest from output */
                    from_source = output;
                  }
                }
                else if (wnext < op) {      /* wrap around window */
                  from += wsize + wnext - op;
                  op -= wnext;
                  if (op < len) {         /* some from end of window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = 0;
                    if (wnext < len) {  /* some from start of window */
                      op = wnext;
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist;      /* rest from output */
                      from_source = output;
                    }
                  }
                }
                else {                      /* contiguous in window */
                  from += wnext - op;
                  if (op < len) {         /* some from window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;  /* rest from output */
                    from_source = output;
                  }
                }
                while (len > 2) {
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  len -= 3;
                }
                if (len) {
                  output[_out++] = from_source[from++];
                  if (len > 1) {
                    output[_out++] = from_source[from++];
                  }
                }
              }
              else {
                from = _out - dist;          /* copy direct from output */
                do {                        /* minimum length is three */
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  len -= 3;
                } while (len > 2);
                if (len) {
                  output[_out++] = output[from++];
                  if (len > 1) {
                    output[_out++] = output[from++];
                  }
                }
              }
            }
            else if ((op & 64) === 0) {          /* 2nd level distance code */
              here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
              continue dodist;
            }
            else {
              strm.msg = 'invalid distance code';
              state.mode = BAD;
              break top;
            }

            break; // need to emulate goto via "continue"
          }
        }
        else if ((op & 64) === 0) {              /* 2nd level length code */
          here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
          continue dolen;
        }
        else if (op & 32) {                     /* end-of-block */
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.mode = TYPE;
          break top;
        }
        else {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break top;
        }

        break; // need to emulate goto via "continue"
      }
    } while (_in < last && _out < end);

    /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;

    /* update state and return */
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
    strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
    state.hold = hold;
    state.bits = bits;
    return;
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  const MAXBITS = 15;
  const ENOUGH_LENS = 852;
  const ENOUGH_DISTS = 592;
  //const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

  const CODES = 0;
  const LENS = 1;
  const DISTS = 2;

  const lbase = new Uint16Array([ /* Length codes 257..285 base */
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
  ]);

  const lext = new Uint8Array([ /* Length codes 257..285 extra */
    16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
    19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
  ]);

  const dbase = new Uint16Array([ /* Distance codes 0..29 base */
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
    257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
    8193, 12289, 16385, 24577, 0, 0
  ]);

  const dext = new Uint8Array([ /* Distance codes 0..29 extra */
    16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
    23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
    28, 28, 29, 29, 64, 64
  ]);

  const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
  {
    const bits = opts.bits;
        //here = opts.here; /* table entry for duplication */

    let len = 0;               /* a code's length in bits */
    let sym = 0;               /* index of code symbols */
    let min = 0, max = 0;          /* minimum and maximum code lengths */
    let root = 0;              /* number of index bits for root table */
    let curr = 0;              /* number of index bits for current table */
    let drop = 0;              /* code bits to drop for sub-table */
    let left = 0;                   /* number of prefix codes available */
    let used = 0;              /* code entries in table used */
    let huff = 0;              /* Huffman code */
    let incr;              /* for incrementing code, index */
    let fill;              /* index for replicating entries */
    let low;               /* low bits for current root entry */
    let mask;              /* mask for low root bits */
    let next;             /* next available space in table */
    let base = null;     /* base value table to use */
    let base_index = 0;
  //  let shoextra;    /* extra bits table to use */
    let end;                    /* use base and extra for symbol > end */
    const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
    const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
    let extra = null;
    let extra_index = 0;

    let here_bits, here_op, here_val;

    /*
     Process a set of code lengths to create a canonical Huffman code.  The
     code lengths are lens[0..codes-1].  Each length corresponds to the
     symbols 0..codes-1.  The Huffman code is generated by first sorting the
     symbols by length from short to long, and retaining the symbol order
     for codes with equal lengths.  Then the code starts with all zero bits
     for the first code of the shortest length, and the codes are integer
     increments for the same length, and zeros are appended as the length
     increases.  For the deflate format, these bits are stored backwards
     from their more natural integer increment ordering, and so when the
     decoding tables are built in the large loop below, the integer codes
     are incremented backwards.

     This routine assumes, but does not check, that all of the entries in
     lens[] are in the range 0..MAXBITS.  The caller must assure this.
     1..MAXBITS is interpreted as that code length.  zero means that that
     symbol does not occur in this code.

     The codes are sorted by computing a count of codes for each length,
     creating from that a table of starting indices for each length in the
     sorted table, and then entering the symbols in order in the sorted
     table.  The sorted table is work[], with that space being provided by
     the caller.

     The length counts are used for other purposes as well, i.e. finding
     the minimum and maximum length codes, determining if there are any
     codes at all, checking for a valid set of lengths, and looking ahead
     at length counts to determine sub-table sizes when building the
     decoding tables.
     */

    /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }

    /* bound code lengths, force root to be within code lengths */
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) { break; }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {                     /* no symbols to code at all */
      //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
      //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
      //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
      table[table_index++] = (1 << 24) | (64 << 16) | 0;


      //table.op[opts.table_index] = 64;
      //table.bits[opts.table_index] = 1;
      //table.val[opts.table_index++] = 0;
      table[table_index++] = (1 << 24) | (64 << 16) | 0;

      opts.bits = 1;
      return 0;     /* no symbols, but wait for decoding to report error */
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) { break; }
    }
    if (root < min) {
      root = min;
    }

    /* check for an over-subscribed or incomplete set of lengths */
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }        /* over-subscribed */
    }
    if (left > 0 && (type === CODES || max !== 1)) {
      return -1;                      /* incomplete set */
    }

    /* generate offsets into symbol table for each length for sorting */
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }

    /* sort symbols by length, by symbol order within each length */
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }

    /*
     Create and fill in decoding tables.  In this loop, the table being
     filled is at next and has curr index bits.  The code being used is huff
     with length len.  That code is converted to an index by dropping drop
     bits off of the bottom.  For codes where len is less than drop + curr,
     those top drop + curr - len bits are incremented through all values to
     fill the table with replicated entries.

     root is the number of index bits for the root table.  When len exceeds
     root, sub-tables are created pointed to by the root entry with an index
     of the low root bits of huff.  This is saved in low to check for when a
     new sub-table should be started.  drop is zero when the root table is
     being filled, and drop is root when sub-tables are being filled.

     When a new sub-table is needed, it is necessary to look ahead in the
     code lengths to determine what size sub-table is needed.  The length
     counts are used for this, and so count[] is decremented as codes are
     entered in the tables.

     used keeps track of how many table entries have been allocated from the
     provided *table space.  It is checked for LENS and DIST tables against
     the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
     the initial root table size constants.  See the comments in inftrees.h
     for more information.

     sym increments through all symbols, and the loop terminates when
     all codes of length max, i.e. all codes, have been processed.  This
     routine permits incomplete codes, so another loop after this one fills
     in the rest of the decoding tables with invalid code markers.
     */

    /* set up for code type */
    // poor man optimization - use if-else instead of switch,
    // to avoid deopts in old v8
    if (type === CODES) {
      base = extra = work;    /* dummy value--not used */
      end = 19;

    } else if (type === LENS) {
      base = lbase;
      base_index -= 257;
      extra = lext;
      extra_index -= 257;
      end = 256;

    } else {                    /* DISTS */
      base = dbase;
      extra = dext;
      end = -1;
    }

    /* initialize opts for loop */
    huff = 0;                   /* starting code */
    sym = 0;                    /* starting code symbol */
    len = min;                  /* starting code length */
    next = table_index;              /* current table to fill in */
    curr = root;                /* current table index bits */
    drop = 0;                   /* current bits to drop from code for index */
    low = -1;                   /* trigger new sub-table when len > root */
    used = 1 << root;          /* use root table entries */
    mask = used - 1;            /* mask for comparing low */

    /* check available table space */
    if ((type === LENS && used > ENOUGH_LENS) ||
      (type === DISTS && used > ENOUGH_DISTS)) {
      return 1;
    }

    /* process all codes and make table entries */
    for (;;) {
      /* create table entry */
      here_bits = len - drop;
      if (work[sym] < end) {
        here_op = 0;
        here_val = work[sym];
      }
      else if (work[sym] > end) {
        here_op = extra[extra_index + work[sym]];
        here_val = base[base_index + work[sym]];
      }
      else {
        here_op = 32 + 64;         /* end of block */
        here_val = 0;
      }

      /* replicate for those indices with low len bits equal to huff */
      incr = 1 << (len - drop);
      fill = 1 << curr;
      min = fill;                 /* save offset to next table */
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
      } while (fill !== 0);

      /* backwards increment the len-bit code huff */
      incr = 1 << (len - 1);
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }

      /* go to next symbol, update count, len */
      sym++;
      if (--count[len] === 0) {
        if (len === max) { break; }
        len = lens[lens_index + work[sym]];
      }

      /* create new sub-table if needed */
      if (len > root && (huff & mask) !== low) {
        /* if first time, transition to sub-tables */
        if (drop === 0) {
          drop = root;
        }

        /* increment past last table */
        next += min;            /* here min is 1 << curr */

        /* determine length of next table */
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) { break; }
          curr++;
          left <<= 1;
        }

        /* check for enough space */
        used += 1 << curr;
        if ((type === LENS && used > ENOUGH_LENS) ||
          (type === DISTS && used > ENOUGH_DISTS)) {
          return 1;
        }

        /* point entry in root table to sub-table */
        low = huff & mask;
        /*table.op[low] = curr;
        table.bits[low] = root;
        table.val[low] = next - opts.table_index;*/
        table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
      }
    }

    /* fill in remaining table entry if code is incomplete (guaranteed to have
     at most one remaining entry, since if the code is incomplete, the
     maximum code length that was allowed to get this far is one bit) */
    if (huff !== 0) {
      //table.op[next + huff] = 64;            /* invalid code marker */
      //table.bits[next + huff] = len - drop;
      //table.val[next + huff] = 0;
      table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
    }

    /* set return parameters */
    //opts.table_index += used;
    opts.bits = root;
    return 0;
  };


  var inftrees = inflate_table;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.






  const CODES$1 = 0;
  const LENS$1 = 1;
  const DISTS$1 = 2;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  const {
    Z_FINISH: Z_FINISH$2, Z_BLOCK: Z_BLOCK$1, Z_TREES,
    Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2, Z_NEED_DICT, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR, Z_BUF_ERROR: Z_BUF_ERROR$1,
    Z_DEFLATED: Z_DEFLATED$2
  } = constants;


  /* STATES ====================================================================*/
  /* ===========================================================================*/


  const    HEAD = 1;       /* i: waiting for magic header */
  const    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
  const    TIME = 3;       /* i: waiting for modification time (gzip) */
  const    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
  const    EXLEN = 5;      /* i: waiting for extra length (gzip) */
  const    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
  const    NAME = 7;       /* i: waiting for end of file name (gzip) */
  const    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
  const    HCRC = 9;       /* i: waiting for header crc (gzip) */
  const    DICTID = 10;    /* i: waiting for dictionary check value */
  const    DICT = 11;      /* waiting for inflateSetDictionary() call */
  const        TYPE$1 = 12;      /* i: waiting for type bits, including last-flag bit */
  const        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
  const        STORED = 14;    /* i: waiting for stored size (length and complement) */
  const        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
  const        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
  const        TABLE = 17;     /* i: waiting for dynamic block table lengths */
  const        LENLENS = 18;   /* i: waiting for code length code lengths */
  const        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
  const            LEN_ = 20;      /* i: same as LEN below, but only first time in */
  const            LEN = 21;       /* i: waiting for length/lit/eob code */
  const            LENEXT = 22;    /* i: waiting for length extra bits */
  const            DIST = 23;      /* i: waiting for distance code */
  const            DISTEXT = 24;   /* i: waiting for distance extra bits */
  const            MATCH = 25;     /* o: waiting for output space to copy string */
  const            LIT = 26;       /* o: waiting for output space to write literal */
  const    CHECK = 27;     /* i: waiting for 32-bit check value */
  const    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
  const    DONE = 29;      /* finished check, done -- remain here until reset */
  const    BAD$1 = 30;       /* got a data error -- remain here until reset */
  const    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
  const    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

  /* ===========================================================================*/



  const ENOUGH_LENS$1 = 852;
  const ENOUGH_DISTS$1 = 592;
  //const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

  const MAX_WBITS$1 = 15;
  /* 32K LZ77 window */
  const DEF_WBITS = MAX_WBITS$1;


  const zswap32 = (q) => {

    return  (((q >>> 24) & 0xff) +
            ((q >>> 8) & 0xff00) +
            ((q & 0xff00) << 8) +
            ((q & 0xff) << 24));
  };


  function InflateState() {
    this.mode = 0;             /* current inflate mode */
    this.last = false;          /* true if processing last block */
    this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
    this.havedict = false;      /* true if dictionary provided */
    this.flags = 0;             /* gzip header method and flags (0 if zlib) */
    this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
    this.check = 0;             /* protected copy of check value */
    this.total = 0;             /* protected copy of output count */
    // TODO: may be {}
    this.head = null;           /* where to save gzip header information */

    /* sliding window */
    this.wbits = 0;             /* log base 2 of requested window size */
    this.wsize = 0;             /* window size or zero if not using window */
    this.whave = 0;             /* valid bytes in the window */
    this.wnext = 0;             /* window write index */
    this.window = null;         /* allocated sliding window, if needed */

    /* bit accumulator */
    this.hold = 0;              /* input bit accumulator */
    this.bits = 0;              /* number of bits in "in" */

    /* for string and stored block copying */
    this.length = 0;            /* literal or length of data to copy */
    this.offset = 0;            /* distance back to copy string from */

    /* for table and code decoding */
    this.extra = 0;             /* extra bits needed */

    /* fixed and dynamic code tables */
    this.lencode = null;          /* starting table for length/literal codes */
    this.distcode = null;         /* starting table for distance codes */
    this.lenbits = 0;           /* index bits for lencode */
    this.distbits = 0;          /* index bits for distcode */

    /* dynamic table building */
    this.ncode = 0;             /* number of code length code lengths */
    this.nlen = 0;              /* number of length code lengths */
    this.ndist = 0;             /* number of distance code lengths */
    this.have = 0;              /* number of code lengths in lens[] */
    this.next = null;              /* next available space in codes[] */

    this.lens = new Uint16Array(320); /* temporary storage for code lengths */
    this.work = new Uint16Array(288); /* work area for code table building */

    /*
     because we don't have pointers in js, we use lencode and distcode directly
     as buffers so we don't need codes
    */
    //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
    this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
    this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
    this.sane = 0;                   /* if false, allow invalid distance too far */
    this.back = 0;                   /* bits back of last unprocessed length/lit */
    this.was = 0;                    /* initial length of match */
  }


  const inflateResetKeep = (strm) => {

    if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = ''; /*Z_NULL*/
    if (state.wrap) {       /* to support ill-conceived Java test suite */
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.dmax = 32768;
    state.head = null/*Z_NULL*/;
    state.hold = 0;
    state.bits = 0;
    //state.lencode = state.distcode = state.next = state.codes;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS$1);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS$1);

    state.sane = 1;
    state.back = -1;
    //Tracev((stderr, "inflate: reset\n"));
    return Z_OK$2;
  };


  const inflateReset = (strm) => {

    if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);

  };


  const inflateReset2 = (strm, windowBits) => {
    let wrap;

    /* get the state */
    if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
    const state = strm.state;

    /* extract wrap request from windowBits parameter */
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    }
    else {
      wrap = (windowBits >> 4) + 1;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }

    /* set number of window bits, free window if different */
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }

    /* update state and reset the rest of it */
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };


  const inflateInit2 = (strm, windowBits) => {

    if (!strm) { return Z_STREAM_ERROR$1; }
    //strm.msg = Z_NULL;                 /* in case we return an error */

    const state = new InflateState();

    //if (state === Z_NULL) return Z_MEM_ERROR;
    //Tracev((stderr, "inflate: allocated\n"));
    strm.state = state;
    state.window = null/*Z_NULL*/;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$2) {
      strm.state = null/*Z_NULL*/;
    }
    return ret;
  };


  const inflateInit = (strm) => {

    return inflateInit2(strm, DEF_WBITS);
  };


  /*
   Return state with length and distance decoding tables and index sizes set to
   fixed code decoding.  Normally this returns fixed tables from inffixed.h.
   If BUILDFIXED is defined, then instead this routine builds the tables the
   first time it's called, and returns those tables the first time and
   thereafter.  This reduces the size of the code by about 2K bytes, in
   exchange for a little execution time.  However, BUILDFIXED should not be
   used for threaded applications, since the rewriting of the tables and virgin
   may not be thread-safe.
   */
  let virgin = true;

  let lenfix, distfix; // We have no pointers in JS, so keep tables separate


  const fixedtables = (state) => {

    /* build fixed huffman tables if first call (may not be thread safe) */
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);

      /* literal/length table */
      let sym = 0;
      while (sym < 144) { state.lens[sym++] = 8; }
      while (sym < 256) { state.lens[sym++] = 9; }
      while (sym < 280) { state.lens[sym++] = 7; }
      while (sym < 288) { state.lens[sym++] = 8; }

      inftrees(LENS$1,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

      /* distance table */
      sym = 0;
      while (sym < 32) { state.lens[sym++] = 5; }

      inftrees(DISTS$1, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

      /* do this just once */
      virgin = false;
    }

    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };


  /*
   Update the window with the last wsize (normally 32K) bytes written before
   returning.  If window does not exist yet, create it.  This is only called
   when a window is already in use, or when output has been written during this
   inflate call, but the end of the deflate stream has not been reached yet.
   It is also called to create a window for dictionary data when a dictionary
   is loaded.

   Providing output buffers larger than 32K to inflate() should provide a speed
   advantage, since only the last 32K of output is copied to the sliding window
   upon return from inflate(), and since all distances after the first 32K of
   output will fall in the output data, making match copies simpler and faster.
   The advantage may be dependent on the size of the processor's data caches.
   */
  const updatewindow = (strm, src, end, copy) => {

    let dist;
    const state = strm.state;

    /* if it hasn't been done already, allocate space for the window */
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;

      state.window = new Uint8Array(state.wsize);
    }

    /* copy state->wsize or less output bytes into the circular window */
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    }
    else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      //zmemcpy(state->window + state->wnext, end - copy, dist);
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        //zmemcpy(state->window, end - copy, copy);
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      }
      else {
        state.wnext += dist;
        if (state.wnext === state.wsize) { state.wnext = 0; }
        if (state.whave < state.wsize) { state.whave += dist; }
      }
    }
    return 0;
  };


  const inflate = (strm, flush) => {

    let state;
    let input, output;          // input/output buffers
    let next;                   /* next input INDEX */
    let put;                    /* next output INDEX */
    let have, left;             /* available input and output */
    let hold;                   /* bit buffer */
    let bits;                   /* bits in bit buffer */
    let _in, _out;              /* save starting available input and output */
    let copy;                   /* number of stored or match bytes to copy */
    let from;                   /* where to copy match bytes from */
    let from_source;
    let here = 0;               /* current decoding table entry */
    let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
    //let last;                   /* parent table entry */
    let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
    let len;                    /* length to copy for repeats, bits to drop */
    let ret;                    /* return code */
    const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
    let opts;

    let n; // temporary variable for NEED_BITS

    const order = /* permutation of code lengths */
      new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


    if (!strm || !strm.state || !strm.output ||
        (!strm.input && strm.avail_in !== 0)) {
      return Z_STREAM_ERROR$1;
    }

    state = strm.state;
    if (state.mode === TYPE$1) { state.mode = TYPEDO; }    /* skip check */


    //--- LOAD() ---
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    //---

    _in = have;
    _out = left;
    ret = Z_OK$2;

    inf_leave: // goto emulation
    for (;;) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          //=== NEEDBITS(16);
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
            state.check = 0/*crc32(0L, Z_NULL, 0)*/;
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//

            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = FLAGS;
            break;
          }
          state.flags = 0;           /* expect zlib header */
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) ||   /* check if zlib header allowed */
            (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
            strm.msg = 'incorrect header check';
            state.mode = BAD$1;
            break;
          }
          if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED$2) {
            strm.msg = 'unknown compression method';
            state.mode = BAD$1;
            break;
          }
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
          len = (hold & 0x0f)/*BITS(4)*/ + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          else if (len > state.wbits) {
            strm.msg = 'invalid window size';
            state.mode = BAD$1;
            break;
          }

          // !!! pako patch. Force use `options.windowBits` if passed.
          // Required to always use max window size by default.
          state.dmax = 1 << state.wbits;
          //state.dmax = 1 << len;

          //Tracev((stderr, "inflate:   zlib header ok\n"));
          strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
          state.mode = hold & 0x200 ? DICTID : TYPE$1;
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          break;
        case FLAGS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.flags = hold;
          if ((state.flags & 0xff) !== Z_DEFLATED$2) {
            strm.msg = 'unknown compression method';
            state.mode = BAD$1;
            break;
          }
          if (state.flags & 0xe000) {
            strm.msg = 'unknown header flags set';
            state.mode = BAD$1;
            break;
          }
          if (state.head) {
            state.head.text = ((hold >> 8) & 1);
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = TIME;
          /* falls through */
        case TIME:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC4(state.check, hold)
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            hbuf[2] = (hold >>> 16) & 0xff;
            hbuf[3] = (hold >>> 24) & 0xff;
            state.check = crc32_1(state.check, hbuf, 4, 0);
            //===
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = OS;
          /* falls through */
        case OS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.xflags = (hold & 0xff);
            state.head.os = (hold >> 8);
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = EXLEN;
          /* falls through */
        case EXLEN:
          if (state.flags & 0x0400) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 0x0200) {
              //=== CRC2(state.check, hold);
              hbuf[0] = hold & 0xff;
              hbuf[1] = (hold >>> 8) & 0xff;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }
          else if (state.head) {
            state.head.extra = null/*Z_NULL*/;
          }
          state.mode = EXTRA;
          /* falls through */
        case EXTRA:
          if (state.flags & 0x0400) {
            copy = state.length;
            if (copy > have) { copy = have; }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  // Use untyped array for more convenient processing later
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(
                  input.subarray(
                    next,
                    // extra field is limited to 65536 bytes
                    // - no need for additional size check
                    next + copy
                  ),
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
                //zmemcpy(state.head.extra + len, next,
                //        len + copy > state.head.extra_max ?
                //        state.head.extra_max - len : copy);
              }
              if (state.flags & 0x0200) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) { break inf_leave; }
          }
          state.length = 0;
          state.mode = NAME;
          /* falls through */
        case NAME:
          if (state.flags & 0x0800) {
            if (have === 0) { break inf_leave; }
            copy = 0;
            do {
              // TODO: 2 or 1 bytes?
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len &&
                  (state.length < 65536 /*state.head.name_max*/)) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);

            if (state.flags & 0x0200) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) { break inf_leave; }
          }
          else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
          /* falls through */
        case COMMENT:
          if (state.flags & 0x1000) {
            if (have === 0) { break inf_leave; }
            copy = 0;
            do {
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len &&
                  (state.length < 65536 /*state.head.comm_max*/)) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 0x0200) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) { break inf_leave; }
          }
          else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
          /* falls through */
        case HCRC:
          if (state.flags & 0x0200) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if (hold !== (state.check & 0xffff)) {
              strm.msg = 'header crc mismatch';
              state.mode = BAD$1;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }
          if (state.head) {
            state.head.hcrc = ((state.flags >> 9) & 1);
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE$1;
          break;
        case DICTID:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          strm.adler = state.check = zswap32(hold);
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = DICT;
          /* falls through */
        case DICT:
          if (state.havedict === 0) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            return Z_NEED_DICT;
          }
          strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
          state.mode = TYPE$1;
          /* falls through */
        case TYPE$1:
          if (flush === Z_BLOCK$1 || flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case TYPEDO:
          if (state.last) {
            //--- BYTEBITS() ---//
            hold >>>= bits & 7;
            bits -= bits & 7;
            //---//
            state.mode = CHECK;
            break;
          }
          //=== NEEDBITS(3); */
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.last = (hold & 0x01)/*BITS(1)*/;
          //--- DROPBITS(1) ---//
          hold >>>= 1;
          bits -= 1;
          //---//

          switch ((hold & 0x03)/*BITS(2)*/) {
            case 0:                             /* stored block */
              //Tracev((stderr, "inflate:     stored block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = STORED;
              break;
            case 1:                             /* fixed block */
              fixedtables(state);
              //Tracev((stderr, "inflate:     fixed codes block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = LEN_;             /* decode codes */
              if (flush === Z_TREES) {
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
                break inf_leave;
              }
              break;
            case 2:                             /* dynamic block */
              //Tracev((stderr, "inflate:     dynamic codes block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = 'invalid block type';
              state.mode = BAD$1;
          }
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break;
        case STORED:
          //--- BYTEBITS() ---// /* go to byte boundary */
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
            strm.msg = 'invalid stored block lengths';
            state.mode = BAD$1;
            break;
          }
          state.length = hold & 0xffff;
          //Tracev((stderr, "inflate:       stored length %u\n",
          //        state.length));
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = COPY_;
          if (flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case COPY_:
          state.mode = COPY;
          /* falls through */
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) { copy = have; }
            if (copy > left) { copy = left; }
            if (copy === 0) { break inf_leave; }
            //--- zmemcpy(put, next, copy); ---
            output.set(input.subarray(next, next + copy), put);
            //---//
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          //Tracev((stderr, "inflate:       stored end\n"));
          state.mode = TYPE$1;
          break;
        case TABLE:
          //=== NEEDBITS(14); */
          while (bits < 14) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
  //#ifndef PKZIP_BUG_WORKAROUND
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = 'too many length or distance symbols';
            state.mode = BAD$1;
            break;
          }
  //#endif
          //Tracev((stderr, "inflate:       table sizes ok\n"));
          state.have = 0;
          state.mode = LENLENS;
          /* falls through */
        case LENLENS:
          while (state.have < state.ncode) {
            //=== NEEDBITS(3);
            while (bits < 3) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          // We have separate tables & no pointers. 2 commented lines below not needed.
          //state.next = state.codes;
          //state.lencode = state.next;
          // Switch to use dynamic table
          state.lencode = state.lendyn;
          state.lenbits = 7;

          opts = { bits: state.lenbits };
          ret = inftrees(CODES$1, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;

          if (ret) {
            strm.msg = 'invalid code lengths set';
            state.mode = BAD$1;
            break;
          }
          //Tracev((stderr, "inflate:       code lengths ok\n"));
          state.have = 0;
          state.mode = CODELENS;
          /* falls through */
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (;;) {
              here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;

              if ((here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            if (here_val < 16) {
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              state.lens[state.have++] = here_val;
            }
            else {
              if (here_val === 16) {
                //=== NEEDBITS(here.bits + 2);
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                if (state.have === 0) {
                  strm.msg = 'invalid bit length repeat';
                  state.mode = BAD$1;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 0x03);//BITS(2);
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
              }
              else if (here_val === 17) {
                //=== NEEDBITS(here.bits + 3);
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 3 + (hold & 0x07);//BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
                //---//
              }
              else {
                //=== NEEDBITS(here.bits + 7);
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 11 + (hold & 0x7f);//BITS(7);
                //--- DROPBITS(7) ---//
                hold >>>= 7;
                bits -= 7;
                //---//
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD$1;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }

          /* handle error breaks in while */
          if (state.mode === BAD$1) { break; }

          /* check for end-of-block code (better have one) */
          if (state.lens[256] === 0) {
            strm.msg = 'invalid code -- missing end-of-block';
            state.mode = BAD$1;
            break;
          }

          /* build code tables -- note: do not change the lenbits or distbits
             values here (9 and 6) without reading the comments in inftrees.h
             concerning the ENOUGH constants, which depend on those values */
          state.lenbits = 9;

          opts = { bits: state.lenbits };
          ret = inftrees(LENS$1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.lenbits = opts.bits;
          // state.lencode = state.next;

          if (ret) {
            strm.msg = 'invalid literal/lengths set';
            state.mode = BAD$1;
            break;
          }

          state.distbits = 6;
          //state.distcode.copy(state.codes);
          // Switch to use dynamic table
          state.distcode = state.distdyn;
          opts = { bits: state.distbits };
          ret = inftrees(DISTS$1, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.distbits = opts.bits;
          // state.distcode = state.next;

          if (ret) {
            strm.msg = 'invalid distances set';
            state.mode = BAD$1;
            break;
          }
          //Tracev((stderr, 'inflate:       codes ok\n'));
          state.mode = LEN_;
          if (flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case LEN_:
          state.mode = LEN;
          /* falls through */
        case LEN:
          if (have >= 6 && left >= 258) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            inffast(strm, _out);
            //--- LOAD() ---
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            //---

            if (state.mode === TYPE$1) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if (here_bits <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_op && (here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.lencode[last_val +
                      ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;

              if ((last_bits + here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            //Tracevv((stderr, "inflate:         end of block\n"));
            state.back = -1;
            state.mode = TYPE$1;
            break;
          }
          if (here_op & 64) {
            strm.msg = 'invalid literal/length code';
            state.mode = BAD$1;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
          /* falls through */
        case LENEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
          //Tracevv((stderr, "inflate:         length %u\n", state.length));
          state.was = state.length;
          state.mode = DIST;
          /* falls through */
        case DIST:
          for (;;) {
            here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if ((here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.distcode[last_val +
                      ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;

              if ((last_bits + here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break;
          }
          state.offset = here_val;
          state.extra = (here_op) & 15;
          state.mode = DISTEXT;
          /* falls through */
        case DISTEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
  //#ifdef INFLATE_STRICT
          if (state.offset > state.dmax) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD$1;
            break;
          }
  //#endif
          //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
          state.mode = MATCH;
          /* falls through */
        case MATCH:
          if (left === 0) { break inf_leave; }
          copy = _out - left;
          if (state.offset > copy) {         /* copy from window */
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD$1;
                break;
              }
  // (!) This block is disabled in zlib defaults,
  // don't enable it for binary compatibility
  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
  //          Trace((stderr, "inflate.c too far\n"));
  //          copy -= state.whave;
  //          if (copy > state.length) { copy = state.length; }
  //          if (copy > left) { copy = left; }
  //          left -= copy;
  //          state.length -= copy;
  //          do {
  //            output[put++] = 0;
  //          } while (--copy);
  //          if (state.length === 0) { state.mode = LEN; }
  //          break;
  //#endif
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            }
            else {
              from = state.wnext - copy;
            }
            if (copy > state.length) { copy = state.length; }
            from_source = state.window;
          }
          else {                              /* copy from output */
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) { copy = left; }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) { state.mode = LEN; }
          break;
        case LIT:
          if (left === 0) { break inf_leave; }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) { break inf_leave; }
              have--;
              // Use '|' instead of '+' to make sure that result is signed
              hold |= input[next++] << bits;
              bits += 8;
            }
            //===//
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (_out) {
              strm.adler = state.check =
                  /*UPDATE(state.check, put - _out, _out);*/
                  (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

            }
            _out = left;
            // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
            if ((state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = 'incorrect data check';
              state.mode = BAD$1;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   check matches trailer\n"));
          }
          state.mode = LENGTH;
          /* falls through */
        case LENGTH:
          if (state.wrap && state.flags) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if (hold !== (state.total & 0xffffffff)) {
              strm.msg = 'incorrect length check';
              state.mode = BAD$1;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   length matches trailer\n"));
          }
          state.mode = DONE;
          /* falls through */
        case DONE:
          ret = Z_STREAM_END$2;
          break inf_leave;
        case BAD$1:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR;
        case SYNC:
          /* falls through */
        default:
          return Z_STREAM_ERROR$1;
      }
    }

    // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

    /*
       Return from inflate(), updating the total counts and the check value.
       If there was no progress during the inflate() call, return a buffer
       error.  Call updatewindow() to create and/or update the window state.
       Note: a memory error from inflate() is non-recoverable.
     */

    //--- RESTORE() ---
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    //---

    if (state.wsize || (_out !== strm.avail_out && state.mode < BAD$1 &&
                        (state.mode < CHECK || flush !== Z_FINISH$2))) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap && _out) {
      strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
        (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) +
                      (state.mode === TYPE$1 ? 128 : 0) +
                      (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if (((_in === 0 && _out === 0) || flush === Z_FINISH$2) && ret === Z_OK$2) {
      ret = Z_BUF_ERROR$1;
    }
    return ret;
  };


  const inflateEnd = (strm) => {

    if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
      return Z_STREAM_ERROR$1;
    }

    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$2;
  };


  const inflateGetHeader = (strm, head) => {

    /* check state */
    if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
    const state = strm.state;
    if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

    /* save header structure */
    state.head = head;
    head.done = false;
    return Z_OK$2;
  };


  const inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;

    let state;
    let dictid;
    let ret;

    /* check state */
    if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR$1; }
    state = strm.state;

    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }

    /* check for correct dictionary identifier */
    if (state.mode === DICT) {
      dictid = 1; /* adler32(0, null, 0)*/
      /* dictid = adler32(dictid, dictionary, dictLength); */
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    /* copy dictionary to window using updatewindow(), which will amend the
     existing dictionary if appropriate */
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
    state.havedict = 1;
    // Tracev((stderr, "inflate:   dictionary set\n"));
    return Z_OK$2;
  };


  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2 = inflate;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = 'pako inflate (from Nodeca project)';

  /* Not implemented
  module.exports.inflateCopy = inflateCopy;
  module.exports.inflateGetDictionary = inflateGetDictionary;
  module.exports.inflateMark = inflateMark;
  module.exports.inflatePrime = inflatePrime;
  module.exports.inflateSync = inflateSync;
  module.exports.inflateSyncPoint = inflateSyncPoint;
  module.exports.inflateUndermine = inflateUndermine;
  */

  var inflate_1 = {
  	inflateReset: inflateReset_1,
  	inflateReset2: inflateReset2_1,
  	inflateResetKeep: inflateResetKeep_1,
  	inflateInit: inflateInit_1,
  	inflateInit2: inflateInit2_1,
  	inflate: inflate_2,
  	inflateEnd: inflateEnd_1,
  	inflateGetHeader: inflateGetHeader_1,
  	inflateSetDictionary: inflateSetDictionary_1,
  	inflateInfo: inflateInfo
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  function GZheader() {
    /* true if compressed data believed to be text */
    this.text       = 0;
    /* modification time */
    this.time       = 0;
    /* extra flags (not used when writing a gzip file) */
    this.xflags     = 0;
    /* operating system */
    this.os         = 0;
    /* pointer to extra field or Z_NULL if none */
    this.extra      = null;
    /* extra field length (valid if extra != Z_NULL) */
    this.extra_len  = 0; // Actually, we don't need it in JS,
                         // but leave for few code modifications

    //
    // Setup limits is not necessary because in js we should not preallocate memory
    // for inflate use constant limit in 65536 bytes
    //

    /* space at extra (only when reading header) */
    // this.extra_max  = 0;
    /* pointer to zero-terminated file name or Z_NULL */
    this.name       = '';
    /* space at name (only when reading header) */
    // this.name_max   = 0;
    /* pointer to zero-terminated comment or Z_NULL */
    this.comment    = '';
    /* space at comment (only when reading header) */
    // this.comm_max   = 0;
    /* true if there was or will be a header crc */
    this.hcrc       = 0;
    /* true when done reading gzip header (not used when writing a gzip file) */
    this.done       = false;
  }

  var gzheader = GZheader;

  const toString$1$1 = Object.prototype.toString;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  const {
    Z_NO_FLUSH: Z_NO_FLUSH$2, Z_FINISH: Z_FINISH$3,
    Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_MEM_ERROR: Z_MEM_ERROR$1
  } = constants;

  /* ===========================================================================*/


  /**
   * class Inflate
   *
   * Generic JS-style wrapper for zlib calls. If you don't need
   * streaming behaviour - use more simple functions: [[inflate]]
   * and [[inflateRaw]].
   **/

  /* internal
   * inflate.chunks -> Array
   *
   * Chunks of output data, if [[Inflate#onData]] not overridden.
   **/

  /**
   * Inflate.result -> Uint8Array|String
   *
   * Uncompressed result, generated by default [[Inflate#onData]]
   * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
   * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
   **/

  /**
   * Inflate.err -> Number
   *
   * Error code after inflate finished. 0 (Z_OK) on success.
   * Should be checked if broken data possible.
   **/

  /**
   * Inflate.msg -> String
   *
   * Error message, if [[Inflate.err]] != 0
   **/


  /**
   * new Inflate(options)
   * - options (Object): zlib inflate options.
   *
   * Creates new inflator instance with specified params. Throws exception
   * on bad params. Supported options:
   *
   * - `windowBits`
   * - `dictionary`
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information on these.
   *
   * Additional options, for internal needs:
   *
   * - `chunkSize` - size of generated data chunks (16K by default)
   * - `raw` (Boolean) - do raw inflate
   * - `to` (String) - if equal to 'string', then result will be converted
   *   from utf8 to utf16 (javascript) string. When string output requested,
   *   chunk length can differ from `chunkSize`, depending on content.
   *
   * By default, when no options set, autodetect deflate/gzip data format via
   * wrapper header.
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako')
   * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
   * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
   *
   * const inflate = new pako.Inflate({ level: 3});
   *
   * inflate.push(chunk1, false);
   * inflate.push(chunk2, true);  // true -> last chunk
   *
   * if (inflate.err) { throw new Error(inflate.err); }
   *
   * console.log(inflate.result);
   * ```
   **/
  function Inflate(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ''
    }, options || {});

    const opt = this.options;

    // Force window size for `raw` data, if not set directly,
    // because we have no header for autodetect.
    if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) { opt.windowBits = -15; }
    }

    // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
    if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
        !(options && options.windowBits)) {
      opt.windowBits += 32;
    }

    // Gzip header has no info about windows size, we can do autodetect only
    // for deflate. So, if window size not set, force it to max when gzip possible
    if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
      // bit 3 (16) -> gzipped data
      // bit 4 (32) -> autodetect gzip/deflate
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }

    this.err    = 0;      // error code, if happens (0 = Z_OK)
    this.msg    = '';     // error message
    this.ended  = false;  // used to avoid multiple onEnd() calls
    this.chunks = [];     // chunks of compressed data

    this.strm   = new zstream();
    this.strm.avail_out = 0;

    let status  = inflate_1.inflateInit2(
      this.strm,
      opt.windowBits
    );

    if (status !== Z_OK$3) {
      throw new Error(messages[status]);
    }

    this.header = new gzheader();

    inflate_1.inflateGetHeader(this.strm, this.header);

    // Setup dictionary
    if (opt.dictionary) {
      // Convert data if needed
      if (typeof opt.dictionary === 'string') {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString$1$1.call(opt.dictionary) === '[object ArrayBuffer]') {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) { //In raw mode we need to set the dictionary early
        status = inflate_1.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK$3) {
          throw new Error(messages[status]);
        }
      }
    }
  }

  /**
   * Inflate#push(data[, flush_mode]) -> Boolean
   * - data (Uint8Array|ArrayBuffer): input data
   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
   *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
   *   `true` means Z_FINISH.
   *
   * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
   * new output chunks. Returns `true` on success. If end of stream detected,
   * [[Inflate#onEnd]] will be called.
   *
   * `flush_mode` is not needed for normal operation, because end of stream
   * detected automatically. You may try to use it for advanced things, but
   * this functionality was not tested.
   *
   * On fail call [[Inflate#onEnd]] with error code and return false.
   *
   * ##### Example
   *
   * ```javascript
   * push(chunk, false); // push one of data chunks
   * ...
   * push(chunk, true);  // push last chunk
   * ```
   **/
  Inflate.prototype.push = function (data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;

    if (this.ended) return false;

    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH$3 : Z_NO_FLUSH$2;

    // Convert data if needed
    if (toString$1$1.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }

    strm.next_in = 0;
    strm.avail_in = strm.input.length;

    for (;;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }

      status = inflate_1.inflate(strm, _flush_mode);

      if (status === Z_NEED_DICT$1 && dictionary) {
        status = inflate_1.inflateSetDictionary(strm, dictionary);

        if (status === Z_OK$3) {
          status = inflate_1.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR$2) {
          // Replace code with more verbose
          status = Z_NEED_DICT$1;
        }
      }

      // Skip snyc markers if more data follows and not raw mode
      while (strm.avail_in > 0 &&
             status === Z_STREAM_END$3 &&
             strm.state.wrap > 0 &&
             data[strm.next_in] !== 0)
      {
        inflate_1.inflateReset(strm);
        status = inflate_1.inflate(strm, _flush_mode);
      }

      switch (status) {
        case Z_STREAM_ERROR$2:
        case Z_DATA_ERROR$2:
        case Z_NEED_DICT$1:
        case Z_MEM_ERROR$1:
          this.onEnd(status);
          this.ended = true;
          return false;
      }

      // Remember real `avail_out` value, because we may patch out buffer content
      // to align utf8 strings boundaries.
      last_avail_out = strm.avail_out;

      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END$3) {

          if (this.options.to === 'string') {

            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);

            // move tail & realign counters
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

            this.onData(utf8str);

          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }

      // Must repeat iteration if out buffer is full
      if (status === Z_OK$3 && last_avail_out === 0) continue;

      // Finalize if end of stream reached.
      if (status === Z_STREAM_END$3) {
        status = inflate_1.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }

      if (strm.avail_in === 0) break;
    }

    return true;
  };


  /**
   * Inflate#onData(chunk) -> Void
   * - chunk (Uint8Array|String): output data. When string output requested,
   *   each chunk will be string.
   *
   * By default, stores data blocks in `chunks[]` property and glue
   * those in `onEnd`. Override this handler, if you need another behaviour.
   **/
  Inflate.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
  };


  /**
   * Inflate#onEnd(status) -> Void
   * - status (Number): inflate status. 0 (Z_OK) on success,
   *   other if not.
   *
   * Called either after you tell inflate that the input stream is
   * complete (Z_FINISH). By default - join collected chunks,
   * free memory and fill `results` / `err` properties.
   **/
  Inflate.prototype.onEnd = function (status) {
    // On success - join
    if (status === Z_OK$3) {
      if (this.options.to === 'string') {
        this.result = this.chunks.join('');
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };


  /**
   * inflate(data[, options]) -> Uint8Array|String
   * - data (Uint8Array): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * Decompress `data` with inflate/ungzip and `options`. Autodetect
   * format via wrapper header by default. That's why we don't provide
   * separate `ungzip` method.
   *
   * Supported options are:
   *
   * - windowBits
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information.
   *
   * Sugar (options):
   *
   * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
   *   negative windowBits implicitly.
   * - `to` (String) - if equal to 'string', then result will be converted
   *   from utf8 to utf16 (javascript) string. When string output requested,
   *   chunk length can differ from `chunkSize`, depending on content.
   *
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako');
   * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
   * let output;
   *
   * try {
   *   output = pako.inflate(input);
   * } catch (err)
   *   console.log(err);
   * }
   * ```
   **/
  function inflate$1(input, options) {
    const inflator = new Inflate(options);

    inflator.push(input);

    // That will never happens, if you don't cheat with options :)
    if (inflator.err) throw inflator.msg || messages[inflator.err];

    return inflator.result;
  }


  /**
   * inflateRaw(data[, options]) -> Uint8Array|String
   * - data (Uint8Array): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * The same as [[inflate]], but creates raw data, without wrapper
   * (header and adler32 crc).
   **/
  function inflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }


  /**
   * ungzip(data[, options]) -> Uint8Array|String
   * - data (Uint8Array): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * Just shortcut to [[inflate]], because it autodetects format
   * by header.content. Done for convenience.
   **/


  var Inflate_1 = Inflate;
  var inflate_2$1 = inflate$1;
  var inflateRaw_1 = inflateRaw;
  var ungzip = inflate$1;
  var constants$2 = constants;

  var inflate_1$1 = {
  	Inflate: Inflate_1,
  	inflate: inflate_2$1,
  	inflateRaw: inflateRaw_1,
  	ungzip: ungzip,
  	constants: constants$2
  };

  const { Inflate: Inflate$1, inflate: inflate$2, inflateRaw: inflateRaw$1, ungzip: ungzip$1 } = inflate_1$1;
  var Inflate_1$1 = Inflate$1;

  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
  const crcTable$1 = [];
  for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
          if (c & 1) {
              c = 0xedb88320 ^ (c >>> 1);
          }
          else {
              c = c >>> 1;
          }
      }
      crcTable$1[n] = c;
  }
  const initialCrc = 0xffffffff;
  function updateCrc(currentCrc, data, length) {
      let c = currentCrc;
      for (let n = 0; n < length; n++) {
          c = crcTable$1[(c ^ data[n]) & 0xff] ^ (c >>> 8);
      }
      return c;
  }
  function crc(data, length) {
      return (updateCrc(initialCrc, data, length) ^ initialCrc) >>> 0;
  }

  var ColorType;
  (function (ColorType) {
      ColorType[ColorType["UNKNOWN"] = -1] = "UNKNOWN";
      ColorType[ColorType["GREYSCALE"] = 0] = "GREYSCALE";
      ColorType[ColorType["TRUECOLOUR"] = 2] = "TRUECOLOUR";
      ColorType[ColorType["INDEXED_COLOUR"] = 3] = "INDEXED_COLOUR";
      ColorType[ColorType["GREYSCALE_ALPHA"] = 4] = "GREYSCALE_ALPHA";
      ColorType[ColorType["TRUECOLOUR_ALPHA"] = 6] = "TRUECOLOUR_ALPHA";
  })(ColorType || (ColorType = {}));
  var CompressionMethod;
  (function (CompressionMethod) {
      CompressionMethod[CompressionMethod["UNKNOWN"] = -1] = "UNKNOWN";
      CompressionMethod[CompressionMethod["DEFLATE"] = 0] = "DEFLATE";
  })(CompressionMethod || (CompressionMethod = {}));
  var FilterMethod;
  (function (FilterMethod) {
      FilterMethod[FilterMethod["UNKNOWN"] = -1] = "UNKNOWN";
      FilterMethod[FilterMethod["ADAPTIVE"] = 0] = "ADAPTIVE";
  })(FilterMethod || (FilterMethod = {}));
  var InterlaceMethod;
  (function (InterlaceMethod) {
      InterlaceMethod[InterlaceMethod["UNKNOWN"] = -1] = "UNKNOWN";
      InterlaceMethod[InterlaceMethod["NO_INTERLACE"] = 0] = "NO_INTERLACE";
      InterlaceMethod[InterlaceMethod["ADAM7"] = 1] = "ADAM7";
  })(InterlaceMethod || (InterlaceMethod = {}));

  const empty = new Uint8Array(0);
  const NULL = '\0';
  const uint16 = new Uint16Array([0x00ff]);
  const uint8 = new Uint8Array(uint16.buffer);
  const osIsLittleEndian = uint8[0] === 0xff;
  class PNGDecoder extends IOBuffer {
      constructor(data, options = {}) {
          super(data);
          const { checkCrc = false } = options;
          this._checkCrc = checkCrc;
          this._inflator = new Inflate_1$1();
          this._png = {
              width: -1,
              height: -1,
              channels: -1,
              data: new Uint8Array(0),
              depth: 1,
              text: {},
          };
          this._end = false;
          this._hasPalette = false;
          this._palette = [];
          this._compressionMethod = CompressionMethod.UNKNOWN;
          this._filterMethod = FilterMethod.UNKNOWN;
          this._interlaceMethod = InterlaceMethod.UNKNOWN;
          this._colorType = -1;
          // PNG is always big endian
          // https://www.w3.org/TR/PNG/#7Integers-and-byte-order
          this.setBigEndian();
      }
      decode() {
          this.decodeSignature();
          while (!this._end) {
              this.decodeChunk();
          }
          this.decodeImage();
          return this._png;
      }
      // https://www.w3.org/TR/PNG/#5PNG-file-signature
      decodeSignature() {
          for (let i = 0; i < pngSignature.length; i++) {
              if (this.readUint8() !== pngSignature[i]) {
                  throw new Error(`wrong PNG signature. Byte at ${i} should be ${pngSignature[i]}.`);
              }
          }
      }
      // https://www.w3.org/TR/PNG/#5Chunk-layout
      decodeChunk() {
          const length = this.readUint32();
          const type = this.readChars(4);
          const offset = this.offset;
          switch (type) {
              // 11.2 Critical chunks
              case 'IHDR': // 11.2.2 IHDR Image header
                  this.decodeIHDR();
                  break;
              case 'PLTE': // 11.2.3 PLTE Palette
                  this.decodePLTE(length);
                  break;
              case 'IDAT': // 11.2.4 IDAT Image data
                  this.decodeIDAT(length);
                  break;
              case 'IEND': // 11.2.5 IEND Image trailer
                  this._end = true;
                  break;
              // 11.3 Ancillary chunks
              case 'tRNS': // 11.3.2.1 tRNS Transparency
                  this.decodetRNS(length);
                  break;
              case 'tEXt': // 11.3.4.3 tEXt Textual data
                  this.decodetEXt(length);
                  break;
              case 'pHYs': // 11.3.5.3 pHYs Physical pixel dimensions
                  this.decodepHYs();
                  break;
              default:
                  this.skip(length);
                  break;
          }
          if (this.offset - offset !== length) {
              throw new Error(`Length mismatch while decoding chunk ${type}`);
          }
          if (this._checkCrc) {
              const expectedCrc = this.readUint32();
              const crcLength = length + 4; // includes type
              const actualCrc = crc(new Uint8Array(this.buffer, this.byteOffset + this.offset - crcLength - 4, crcLength), crcLength); // "- 4" because we already advanced by reading the CRC
              if (actualCrc !== expectedCrc) {
                  throw new Error(`CRC mismatch for chunk ${type}. Expected ${expectedCrc}, found ${actualCrc}`);
              }
          }
          else {
              this.skip(4);
          }
      }
      // https://www.w3.org/TR/PNG/#11IHDR
      decodeIHDR() {
          const image = this._png;
          image.width = this.readUint32();
          image.height = this.readUint32();
          image.depth = checkBitDepth(this.readUint8());
          const colorType = this.readUint8();
          this._colorType = colorType;
          let channels;
          switch (colorType) {
              case ColorType.GREYSCALE:
                  channels = 1;
                  break;
              case ColorType.TRUECOLOUR:
                  channels = 3;
                  break;
              case ColorType.INDEXED_COLOUR:
                  channels = 1;
                  break;
              case ColorType.GREYSCALE_ALPHA:
                  channels = 2;
                  break;
              case ColorType.TRUECOLOUR_ALPHA:
                  channels = 4;
                  break;
              default:
                  throw new Error(`Unknown color type: ${colorType}`);
          }
          this._png.channels = channels;
          this._compressionMethod = this.readUint8();
          if (this._compressionMethod !== CompressionMethod.DEFLATE) {
              throw new Error(`Unsupported compression method: ${this._compressionMethod}`);
          }
          this._filterMethod = this.readUint8();
          this._interlaceMethod = this.readUint8();
      }
      // https://www.w3.org/TR/PNG/#11PLTE
      decodePLTE(length) {
          if (length % 3 !== 0) {
              throw new RangeError(`PLTE field length must be a multiple of 3. Got ${length}`);
          }
          const l = length / 3;
          this._hasPalette = true;
          const palette = [];
          this._palette = palette;
          for (let i = 0; i < l; i++) {
              palette.push([this.readUint8(), this.readUint8(), this.readUint8()]);
          }
      }
      // https://www.w3.org/TR/PNG/#11IDAT
      decodeIDAT(length) {
          this._inflator.push(new Uint8Array(this.buffer, this.offset + this.byteOffset, length));
          this.skip(length);
      }
      // https://www.w3.org/TR/PNG/#11tRNS
      decodetRNS(length) {
          // TODO: support other color types.
          if (this._colorType === 3) {
              if (length > this._palette.length) {
                  throw new Error(`tRNS chunk contains more alpha values than there are palette colors (${length} vs ${this._palette.length})`);
              }
              let i = 0;
              for (; i < length; i++) {
                  const alpha = this.readByte();
                  this._palette[i].push(alpha);
              }
              for (; i < this._palette.length; i++) {
                  this._palette[i].push(255);
              }
          }
      }
      // https://www.w3.org/TR/PNG/#11tEXt
      decodetEXt(length) {
          let keyword = '';
          let char;
          while ((char = this.readChar()) !== NULL) {
              keyword += char;
          }
          this._png.text[keyword] = this.readChars(length - keyword.length - 1);
      }
      // https://www.w3.org/TR/PNG/#11pHYs
      decodepHYs() {
          const ppuX = this.readUint32();
          const ppuY = this.readUint32();
          const unitSpecifier = this.readByte();
          this._png.resolution = { x: ppuX, y: ppuY, unit: unitSpecifier };
      }
      decodeImage() {
          if (this._inflator.err) {
              throw new Error(`Error while decompressing the data: ${this._inflator.err}`);
          }
          const data = this._inflator.result;
          if (this._filterMethod !== FilterMethod.ADAPTIVE) {
              throw new Error(`Filter method ${this._filterMethod} not supported`);
          }
          if (this._interlaceMethod === InterlaceMethod.NO_INTERLACE) {
              this.decodeInterlaceNull(data);
          }
          else {
              throw new Error(`Interlace method ${this._interlaceMethod} not supported`);
          }
      }
      decodeInterlaceNull(data) {
          const height = this._png.height;
          const bytesPerPixel = (this._png.channels * this._png.depth) / 8;
          const bytesPerLine = this._png.width * bytesPerPixel;
          const newData = new Uint8Array(this._png.height * bytesPerLine);
          let prevLine = empty;
          let offset = 0;
          let currentLine;
          let newLine;
          for (let i = 0; i < height; i++) {
              currentLine = data.subarray(offset + 1, offset + 1 + bytesPerLine);
              newLine = newData.subarray(i * bytesPerLine, (i + 1) * bytesPerLine);
              switch (data[offset]) {
                  case 0:
                      unfilterNone(currentLine, newLine, bytesPerLine);
                      break;
                  case 1:
                      unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel);
                      break;
                  case 2:
                      unfilterUp(currentLine, newLine, prevLine, bytesPerLine);
                      break;
                  case 3:
                      unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
                      break;
                  case 4:
                      unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
                      break;
                  default:
                      throw new Error(`Unsupported filter: ${data[offset]}`);
              }
              prevLine = newLine;
              offset += bytesPerLine + 1;
          }
          if (this._hasPalette) {
              this._png.palette = this._palette;
          }
          if (this._png.depth === 16) {
              const uint16Data = new Uint16Array(newData.buffer);
              if (osIsLittleEndian) {
                  for (let k = 0; k < uint16Data.length; k++) {
                      // PNG is always big endian. Swap the bytes.
                      uint16Data[k] = swap16(uint16Data[k]);
                  }
              }
              this._png.data = uint16Data;
          }
          else {
              this._png.data = newData;
          }
      }
  }
  function unfilterNone(currentLine, newLine, bytesPerLine) {
      for (let i = 0; i < bytesPerLine; i++) {
          newLine[i] = currentLine[i];
      }
  }
  function unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel) {
      let i = 0;
      for (; i < bytesPerPixel; i++) {
          // just copy first bytes
          newLine[i] = currentLine[i];
      }
      for (; i < bytesPerLine; i++) {
          newLine[i] = (currentLine[i] + newLine[i - bytesPerPixel]) & 0xff;
      }
  }
  function unfilterUp(currentLine, newLine, prevLine, bytesPerLine) {
      let i = 0;
      if (prevLine.length === 0) {
          // just copy bytes for first line
          for (; i < bytesPerLine; i++) {
              newLine[i] = currentLine[i];
          }
      }
      else {
          for (; i < bytesPerLine; i++) {
              newLine[i] = (currentLine[i] + prevLine[i]) & 0xff;
          }
      }
  }
  function unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
      let i = 0;
      if (prevLine.length === 0) {
          for (; i < bytesPerPixel; i++) {
              newLine[i] = currentLine[i];
          }
          for (; i < bytesPerLine; i++) {
              newLine[i] = (currentLine[i] + (newLine[i - bytesPerPixel] >> 1)) & 0xff;
          }
      }
      else {
          for (; i < bytesPerPixel; i++) {
              newLine[i] = (currentLine[i] + (prevLine[i] >> 1)) & 0xff;
          }
          for (; i < bytesPerLine; i++) {
              newLine[i] =
                  (currentLine[i] + ((newLine[i - bytesPerPixel] + prevLine[i]) >> 1)) &
                      0xff;
          }
      }
  }
  function unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
      let i = 0;
      if (prevLine.length === 0) {
          for (; i < bytesPerPixel; i++) {
              newLine[i] = currentLine[i];
          }
          for (; i < bytesPerLine; i++) {
              newLine[i] = (currentLine[i] + newLine[i - bytesPerPixel]) & 0xff;
          }
      }
      else {
          for (; i < bytesPerPixel; i++) {
              newLine[i] = (currentLine[i] + prevLine[i]) & 0xff;
          }
          for (; i < bytesPerLine; i++) {
              newLine[i] =
                  (currentLine[i] +
                      paethPredictor(newLine[i - bytesPerPixel], prevLine[i], prevLine[i - bytesPerPixel])) &
                      0xff;
          }
      }
  }
  function paethPredictor(a, b, c) {
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      if (pa <= pb && pa <= pc)
          return a;
      else if (pb <= pc)
          return b;
      else
          return c;
  }
  function swap16(val) {
      return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
  }
  function checkBitDepth(value) {
      if (value !== 1 &&
          value !== 2 &&
          value !== 4 &&
          value !== 8 &&
          value !== 16) {
          throw new Error(`invalid bit depth: ${value}`);
      }
      return value;
  }

  var ResolutionUnitSpecifier;
  (function (ResolutionUnitSpecifier) {
      /**
       * Unit is unknown
       */
      ResolutionUnitSpecifier[ResolutionUnitSpecifier["UNKNOWN"] = 0] = "UNKNOWN";
      /**
       * Unit is the metre
       */
      ResolutionUnitSpecifier[ResolutionUnitSpecifier["METRE"] = 1] = "METRE";
  })(ResolutionUnitSpecifier || (ResolutionUnitSpecifier = {}));

  function decodePNG(data, options) {
      const decoder = new PNGDecoder(data, options);
      return decoder.decode();
  }

  class gltfImage extends GltfObject
  {
      constructor(
          uri = undefined,
          type = GL.TEXTURE_2D,
          miplevel = 0,
          bufferView = undefined,
          name = undefined,
          mimeType = ImageMimeType.JPEG,
          image = undefined)
      {
          super();
          this.uri = uri;
          this.bufferView = bufferView;
          this.mimeType = mimeType;
          this.image = image; // javascript image
          this.name = name;
          this.type = type; // nonstandard
          this.miplevel = miplevel; // nonstandard
      }

      resolveRelativePath(basePath)
      {
          if (typeof this.uri === 'string' || this.uri instanceof String)
          {
              if (this.uri.startsWith('./'))
              {
                  // Remove preceding './' from URI.
                  this.uri = this.uri.substr(2);
              }
              this.uri = basePath + this.uri;
          }
      }

      async load(gltf, additionalFiles = undefined)
      {
          if (this.image !== undefined)
          {
              if (this.mimeType !== ImageMimeType.GLTEXTURE)
              {
                  console.error("image has already been loaded");
              }
              return;
          }

          if (!await this.setImageFromBufferView(gltf) &&
              !await this.setImageFromFiles(additionalFiles, gltf) &&
              !await this.setImageFromUri(gltf))
          {
              console.error("Was not able to resolve image with uri '%s'", this.uri);
              return;
          }

          return;
      }

      static loadHTMLImage(url)
      {
          return new Promise( (resolve, reject) => {
              const image = new Image();
              image.addEventListener('load', () => resolve(image) );
              image.addEventListener('error', reject);
              image.src = url;
              image.crossOrigin = "";
          });
      }

      async setImageFromUri(gltf)
      {
          if (this.uri === undefined)
          {
              return false;
          }

          if(this.mimeType === ImageMimeType.KTX2)
          {
              if (gltf.ktxDecoder !== undefined)
              {
                  this.image = await gltf.ktxDecoder.loadKtxFromUri(this.uri);
              }
              else
              {
                  console.warn('Loading of ktx images failed: KtxDecoder not initalized');
              }
          }
          else if (typeof(Image) !== 'undefined' && (this.mimeType === ImageMimeType.JPEG || this.mimeType === ImageMimeType.PNG))
          {
              this.image = await gltfImage.loadHTMLImage(this.uri).catch( (error) => {
                  console.error(error);
              });
          }
          else if(this.mimeType === ImageMimeType.JPEG && this.uri instanceof ArrayBuffer)
          {
              this.image = jpegJs_2(this.uri, {useTArray: true});
          }
          else if(this.mimeType === ImageMimeType.PNG && this.uri instanceof ArrayBuffer)
          {
              this.image = decodePNG(this.uri);
          }
          else
          {
              console.error("Unsupported image type " + this.mimeType);
              return false;
          }

          return true;
      }

      async setImageFromBufferView(gltf)
      {
          const view = gltf.bufferViews[this.bufferView];
          if (view === undefined)
          {
              return false;
          }

          const buffer = gltf.buffers[view.buffer].buffer;
          const array = new Uint8Array(buffer, view.byteOffset, view.byteLength);
          if (this.mimeType === ImageMimeType.KTX2)
          {
              if (gltf.ktxDecoder !== undefined)
              {
                  this.image = await gltf.ktxDecoder.loadKtxFromBuffer(array);
              }
              else
              {
                  console.warn('Loading of ktx images failed: KtxDecoder not initalized');
              }
          }
          else if(typeof(Image) !== 'undefined' && (this.mimeType === ImageMimeType.JPEG || this.mimeType === ImageMimeType.PNG))
          {
              const blob = new Blob([array], { "type": this.mimeType });
              const objectURL = URL.createObjectURL(blob);
              this.image = await gltfImage.loadHTMLImage(objectURL).catch( () => {
                  console.error("Could not load image from buffer view");
              });
          }
          else if(this.mimeType === ImageMimeType.JPEG)
          {
              this.image = jpegJs_2(array, {useTArray: true});
          }
          else if(this.mimeType === ImageMimeType.PNG)
          {
              this.image = decodePNG(array);
          }
          else
          {
              console.error("Unsupported image type " + this.mimeType);
              return false;
          }

          return true;
      }

      async setImageFromFiles(files, gltf)
      {
          if (this.uri === undefined || files === undefined)
          {
              return false;
          }

          let foundFile = files.find(function(file)
          {
              const uriName = this.uri.split('\\').pop().split('/').pop();
              if (file.name === uriName)
              {
                  return true;
              }
          }, this);

          if (foundFile === undefined)
          {
              return false;
          }

          if(this.mimeType === ImageMimeType.KTX2)
          {
              if (gltf.ktxDecoder !== undefined)
              {
                  const data = new Uint8Array(await foundFile.arrayBuffer());
                  this.image = await gltf.ktxDecoder.loadKtxFromBuffer(data);
              }
              else
              {
                  console.warn('Loading of ktx images failed: KtxDecoder not initalized');
              }
          }
          else if (typeof(Image) !== 'undefined' && (this.mimeType === ImageMimeType.JPEG || this.mimeType === ImageMimeType.PNG))
          {
              const imageData = await AsyncFileReader.readAsDataURL(foundFile).catch( () => {
                  console.error("Could not load image with FileReader");
              });
              this.image = await gltfImage.loadHTMLImage(imageData).catch( () => {
                  console.error("Could not create image from FileReader image data");
              });
          }
          else
          {
              console.error("Unsupported image type " + this.mimeType);
              return false;
          }


          return true;
      }
  }

  // https://github.com/KhronosGroup/glTF/blob/khr_ktx2_ibl/extensions/2.0/Khronos/KHR_lights_image_based/schema/imageBasedLight.schema.json

  class ImageBasedLight extends GltfObject
  {
      constructor()
      {
          super();
          this.rotation = jsToGl([0, 0, 0, 1]);
          this.brightnessFactor = 1;
          this.brightnessOffset = 0;
          this.specularEnvironmentTexture = undefined;
          this.diffuseEnvironmentTexture = undefined;
          this.sheenEnvironmentTexture = undefined;

          // non-gltf
          this.levelCount = 1;
      }

      fromJson(jsonIBL)
      {
          super.fromJson(jsonIBL);

          if(jsonIBL.extensions !== undefined)
          {
              this.fromJsonExtensions(jsonIBL.extensions);
          }
      }

      fromJsonExtensions(extensions)
      {
          if (extensions.KHR_materials_sheen !== undefined)
          {
              this.sheenEnvironmentTexture = extensions.KHR_materials_sheen.sheenEnvironmentTexture;
          }
      }

      initGl(gltf, webGlContext)
      {
          if (this.diffuseEnvironmentTexture !== undefined)
          {
              const textureObject = gltf.textures[this.diffuseEnvironmentTexture];
              textureObject.type = GL.TEXTURE_CUBE_MAP;
          }
          if (this.specularEnvironmentTexture !== undefined)
          {
              const textureObject = gltf.textures[this.specularEnvironmentTexture];
              textureObject.type = GL.TEXTURE_CUBE_MAP;

              const imageObject = gltf.images[textureObject.source];
              this.levelCount = imageObject.image.levelCount;
          }
          if(this.sheenEnvironmentTexture !== undefined)
          {
              const textureObject = gltf.textures[this.sheenEnvironmentTexture];
              textureObject.type = GL.TEXTURE_CUBE_MAP;

              const imageObject = gltf.images[textureObject.source];
              if (this.levelCount !== imageObject.image.levelCount)
              {
                  console.error("Specular and sheen do not have same level count");
              }
          }
      }
  }

  class gltfTexture extends GltfObject
  {
      constructor(sampler = undefined, source = undefined, type = GL.TEXTURE_2D)
      {
          super();
          this.sampler = sampler; // index to gltfSampler, default sampler ?
          this.source = source; // index to gltfImage

          // non gltf
          this.glTexture = undefined;
          this.type = type;
          this.initialized = false;
          this.mipLevelCount = 0;
      }

      initGl(gltf, webGlContext)
      {
          if (this.sampler === undefined)
          {
              this.sampler = gltf.samplers.length - 1;
          }

          initGlForMembers(this, gltf, webGlContext);
      }

      fromJson(jsonTexture)
      {
          super.fromJson(jsonTexture);
          if (jsonTexture.extensions !== undefined &&
              jsonTexture.extensions.KHR_texture_basisu !== undefined &&
              jsonTexture.extensions.KHR_texture_basisu.source !== undefined)
          {
              this.source = jsonTexture.extensions.KHR_texture_basisu.source;
          }
      }

      destroy()
      {
          if (this.glTexture !== undefined)
          {
              // TODO: this breaks the dependency direction
              WebGl.context.deleteTexture(this.glTexture);
          }

          this.glTexture = undefined;
      }
  }

  class gltfTextureInfo
  {
      constructor(index = undefined, texCoord = 0, linear = true, samplerName = "", generateMips = true) // linear by default
      {
          this.index = index; // reference to gltfTexture
          this.texCoord = texCoord; // which UV set to use
          this.linear = linear;
          this.samplerName = samplerName;
          this.strength = 1.0; // occlusion
          this.scale = 1.0; // normal
          this.generateMips = generateMips;

          this.extensions = undefined;
      }

      initGl(gltf, webGlContext)
      {
          initGlForMembers(this, gltf, webGlContext);
      }

      fromJson(jsonTextureInfo)
      {
          fromKeys(this, jsonTextureInfo);
      }
  }

  class gltfMaterial extends GltfObject
  {
      constructor()
      {
          super();
          this.name = undefined;
          this.pbrMetallicRoughness = undefined;
          this.normalTexture = undefined;
          this.occlusionTexture = undefined;
          this.emissiveTexture = undefined;
          this.emissiveFactor = fromValues(0, 0, 0);
          this.alphaMode = "OPAQUE";
          this.alphaCutoff = 0.5;
          this.doubleSided = false;

          // pbr next extension toggles
          this.hasClearcoat = false;
          this.hasSheen = false;
          this.hasTransmission = false;
          this.hasIOR = false;
          this.hasVolume = false;

          // non gltf properties
          this.type = "unlit";
          this.textures = [];
          this.properties = new Map();
          this.defines = [];
      }

      static createDefault()
      {
          const defaultMaterial = new gltfMaterial();
          defaultMaterial.type = "MR";
          defaultMaterial.name = "Default Material";
          defaultMaterial.defines.push("MATERIAL_METALLICROUGHNESS 1");
          const baseColorFactor = fromValues$1(1, 1, 1, 1);
          const metallicFactor = 1;
          const roughnessFactor = 1;
          defaultMaterial.properties.set("u_BaseColorFactor", baseColorFactor);
          defaultMaterial.properties.set("u_MetallicFactor", metallicFactor);
          defaultMaterial.properties.set("u_RoughnessFactor", roughnessFactor);

          return defaultMaterial;
      }

      getShaderIdentifier()
      {
          switch (this.type)
          {
          default:
          case "SG": // fall through till we sparate shaders
          case "MR": return "pbr.frag";
              //case "SG": return "specular-glossiness.frag" ;
          }
      }

      getDefines(renderingParameters)
      {
          const defines = Array.from(this.defines);

          if (this.hasClearcoat && renderingParameters.enabledExtensions.KHR_materials_clearcoat)
          {
              defines.push("MATERIAL_CLEARCOAT 1");
          }
          if (this.hasSheen && renderingParameters.enabledExtensions.KHR_materials_sheen)
          {
              defines.push("MATERIAL_SHEEN 1");
          }
          if (this.hasTransmission && renderingParameters.enabledExtensions.KHR_materials_transmission)
          {
              defines.push("MATERIAL_TRANSMISSION 1");
          }
          if (this.hasVolume && renderingParameters.enabledExtensions.KHR_materials_volume)
          {
              defines.push("MATERIAL_VOLUME 1");
          }
          if(this.hasIOR && renderingParameters.enabledExtensions.KHR_materials_ior)
          {
              defines.push("MATERIAL_IOR 1");
          }
          if(this.hasSpecular && renderingParameters.enabledExtensions.KHR_materials_specular)
          {
              defines.push("MATERIAL_SPECULAR 1");
          }

          return defines;
      }

      getProperties()
      {
          return this.properties;
      }

      getTextures()
      {
          return this.textures;
      }

      parseTextureInfoExtensions(textureInfo, textureKey)
      {
          if(textureInfo.extensions === undefined)
          {
              return;
          }

          if(textureInfo.extensions.KHR_texture_transform !== undefined)
          {
              const uvTransform = textureInfo.extensions.KHR_texture_transform;

              // override uvset
              if(uvTransform.texCoord !== undefined)
              {
                  textureInfo.texCoord = uvTransform.texCoord;
              }

              let rotation = create();
              let scale = create();
              let translation = create();

              if(uvTransform.rotation !== undefined)
              {
                  const s =  Math.sin(uvTransform.rotation);
                  const c =  Math.cos(uvTransform.rotation);

                  rotation = jsToGl([
                      c, s, 0.0,
                      -s, c, 0.0,
                      0.0, 0.0, 1.0]);
              }

              if(uvTransform.scale !== undefined)
              {
                  scale = jsToGl([uvTransform.scale[0], 0, 0, 0, uvTransform.scale[1], 0, 0, 0, 1]);
              }

              if(uvTransform.offset !== undefined)
              {
                  translation = jsToGl([1, 0, uvTransform.offset[0], 0, 1, uvTransform.offset[1], 0, 0, 1]);
              }

              let uvMatrix = create();
              multiply(uvMatrix, rotation, scale);
              multiply(uvMatrix, uvMatrix, translation);

              this.defines.push("HAS_" + textureKey.toUpperCase() + "_UV_TRANSFORM 1");
              this.properties.set("u_" + textureKey + "UVTransform", uvMatrix);
          }
      }

      initGl(gltf, webGlContext)
      {
          if (this.normalTexture !== undefined)
          {
              this.normalTexture.samplerName = "u_NormalSampler";
              this.parseTextureInfoExtensions(this.normalTexture, "Normal");
              this.textures.push(this.normalTexture);
              this.defines.push("HAS_NORMAL_MAP 1");
              this.properties.set("u_NormalScale", this.normalTexture.scale);
              this.properties.set("u_NormalUVSet", this.normalTexture.texCoord);
          }

          if (this.occlusionTexture !== undefined)
          {
              this.occlusionTexture.samplerName = "u_OcclusionSampler";
              this.parseTextureInfoExtensions(this.occlusionTexture, "Occlusion");
              this.textures.push(this.occlusionTexture);
              this.defines.push("HAS_OCCLUSION_MAP 1");
              this.properties.set("u_OcclusionStrength", this.occlusionTexture.strength);
              this.properties.set("u_OcclusionUVSet", this.occlusionTexture.texCoord);
          }

          this.properties.set("u_EmissiveFactor", this.emissiveFactor);
          if (this.emissiveTexture !== undefined)
          {
              this.emissiveTexture.samplerName = "u_EmissiveSampler";
              this.parseTextureInfoExtensions(this.emissiveTexture, "Emissive");
              this.textures.push(this.emissiveTexture);
              this.defines.push("HAS_EMISSIVE_MAP 1");
              this.properties.set("u_EmissiveUVSet", this.emissiveTexture.texCoord);
          }

          if (this.baseColorTexture !== undefined)
          {
              this.baseColorTexture.samplerName = "u_BaseColorSampler";
              this.parseTextureInfoExtensions(this.baseColorTexture, "BaseColor");
              this.textures.push(this.baseColorTexture);
              this.defines.push("HAS_BASE_COLOR_MAP 1");
              this.properties.set("u_BaseColorUVSet", this.baseColorTexture.texCoord);
          }

          if (this.metallicRoughnessTexture !== undefined)
          {
              this.metallicRoughnessTexture.samplerName = "u_MetallicRoughnessSampler";
              this.parseTextureInfoExtensions(this.metallicRoughnessTexture, "MetallicRoughness");
              this.textures.push(this.metallicRoughnessTexture);
              this.defines.push("HAS_METALLIC_ROUGHNESS_MAP 1");
              this.properties.set("u_MetallicRoughnessUVSet", this.metallicRoughnessTexture.texCoord);
          }

          if (this.diffuseTexture !== undefined)
          {
              this.diffuseTexture.samplerName = "u_DiffuseSampler";
              this.parseTextureInfoExtensions(this.diffuseTexture, "Diffuse");
              this.textures.push(this.diffuseTexture);
              this.defines.push("HAS_DIFFUSE_MAP 1");
              this.properties.set("u_DiffuseUVSet", this.diffuseTexture.texCoord);
          }

          if (this.specularGlossinessTexture !== undefined)
          {
              this.specularGlossinessTexture.samplerName = "u_SpecularGlossinessSampler";
              this.parseTextureInfoExtensions(this.specularGlossinessTexture, "SpecularGlossiness");
              this.textures.push(this.specularGlossinessTexture);
              this.defines.push("HAS_SPECULAR_GLOSSINESS_MAP 1");
              this.properties.set("u_SpecularGlossinessUVSet", this.specularGlossinessTexture.texCoord);
          }

          if(this.alphaMode === 'MASK') // only set cutoff value for mask material
          {
              this.defines.push("ALPHAMODE_MASK 1");
              this.properties.set("u_AlphaCutoff", this.alphaCutoff);
          }
          else if (this.alphaMode === 'OPAQUE')
          {
              this.defines.push("ALPHAMODE_OPAQUE 1");
          }

          if (this.pbrMetallicRoughness !== undefined && this.type !== "SG")
          {
              this.defines.push("MATERIAL_METALLICROUGHNESS 1");

              let baseColorFactor = fromValues$1(1, 1, 1, 1);
              let metallicFactor = 1;
              let roughnessFactor = 1;

              if (this.pbrMetallicRoughness.baseColorFactor !== undefined)
              {
                  baseColorFactor = jsToGl(this.pbrMetallicRoughness.baseColorFactor);
              }

              if (this.pbrMetallicRoughness.metallicFactor !== undefined)
              {
                  metallicFactor = this.pbrMetallicRoughness.metallicFactor;
              }

              if (this.pbrMetallicRoughness.roughnessFactor !== undefined)
              {
                  roughnessFactor = this.pbrMetallicRoughness.roughnessFactor;
              }

              this.properties.set("u_BaseColorFactor", baseColorFactor);
              this.properties.set("u_MetallicFactor", metallicFactor);
              this.properties.set("u_RoughnessFactor", roughnessFactor);
          }

          if (this.extensions !== undefined)
          {
              if (this.extensions.KHR_materials_unlit !== undefined)
              {
                  this.defines.push("MATERIAL_UNLIT 1");
              }

              if (this.extensions.KHR_materials_pbrSpecularGlossiness !== undefined)
              {
                  this.defines.push("MATERIAL_SPECULARGLOSSINESS 1");

                  let diffuseFactor = fromValues$1(1, 1, 1, 1);
                  let specularFactor = fromValues(1, 1, 1);
                  let glossinessFactor = 1;

                  if (this.extensions.KHR_materials_pbrSpecularGlossiness.diffuseFactor !== undefined)
                  {
                      diffuseFactor = jsToGl(this.extensions.KHR_materials_pbrSpecularGlossiness.diffuseFactor);
                  }

                  if (this.extensions.KHR_materials_pbrSpecularGlossiness.specularFactor !== undefined)
                  {
                      specularFactor = jsToGl(this.extensions.KHR_materials_pbrSpecularGlossiness.specularFactor);
                  }

                  if (this.extensions.KHR_materials_pbrSpecularGlossiness.glossinessFactor !== undefined)
                  {
                      glossinessFactor = this.extensions.KHR_materials_pbrSpecularGlossiness.glossinessFactor;
                  }

                  this.properties.set("u_DiffuseFactor", diffuseFactor);
                  this.properties.set("u_SpecularFactor", specularFactor);
                  this.properties.set("u_GlossinessFactor", glossinessFactor);
              }

              // Clearcoat is part of the default metallic-roughness shader
              if(this.extensions.KHR_materials_clearcoat !== undefined)
              {
                  let clearcoatFactor = 0.0;
                  let clearcoatRoughnessFactor = 0.0;

                  this.hasClearcoat = true;

                  if(this.extensions.KHR_materials_clearcoat.clearcoatFactor !== undefined)
                  {
                      clearcoatFactor = this.extensions.KHR_materials_clearcoat.clearcoatFactor;
                  }
                  if(this.extensions.KHR_materials_clearcoat.clearcoatRoughnessFactor !== undefined)
                  {
                      clearcoatRoughnessFactor = this.extensions.KHR_materials_clearcoat.clearcoatRoughnessFactor;
                  }

                  if (this.clearcoatTexture !== undefined)
                  {
                      this.clearcoatTexture.samplerName = "u_ClearcoatSampler";
                      this.parseTextureInfoExtensions(this.clearcoatTexture, "Clearcoat");
                      this.textures.push(this.clearcoatTexture);
                      this.defines.push("HAS_CLEARCOAT_TEXTURE_MAP 1");
                      this.properties.set("u_ClearcoatUVSet", this.clearcoatTexture.texCoord);
                  }
                  if (this.clearcoatRoughnessTexture !== undefined)
                  {
                      this.clearcoatRoughnessTexture.samplerName = "u_ClearcoatRoughnessSampler";
                      this.parseTextureInfoExtensions(this.clearcoatRoughnessTexture, "ClearcoatRoughness");
                      this.textures.push(this.clearcoatRoughnessTexture);
                      this.defines.push("HAS_CLEARCOAT_ROUGHNESS_MAP 1");
                      this.properties.set("u_ClearcoatRoughnessUVSet", this.clearcoatRoughnessTexture.texCoord);
                  }
                  if (this.clearcoatNormalTexture !== undefined)
                  {
                      this.clearcoatNormalTexture.samplerName = "u_ClearcoatNormalSampler";
                      this.parseTextureInfoExtensions(this.clearcoatNormalTexture, "ClearcoatNormal");
                      this.textures.push(this.clearcoatNormalTexture);
                      this.defines.push("HAS_CLEARCOAT_NORMAL_MAP 1");
                      this.properties.set("u_ClearcoatNormalUVSet", this.clearcoatNormalTexture.texCoord);
                      this.properties.set("u_ClearcoatNormalScale", this.clearcoatNormalTexture.scale);

                  }
                  this.properties.set("u_ClearcoatFactor", clearcoatFactor);
                  this.properties.set("u_ClearcoatRoughnessFactor", clearcoatRoughnessFactor);
              }

              // Sheen material extension
              // https://github.com/sebavan/glTF/tree/KHR_materials_sheen/extensions/2.0/Khronos/KHR_materials_sheen
              if(this.extensions.KHR_materials_sheen !== undefined)
              {
                  let sheenRoughnessFactor = 0.0;
                  let sheenColorFactor =  fromValues(1.0, 1.0, 1.0);

                  this.hasSheen = true;

                  if(this.extensions.KHR_materials_sheen.sheenRoughnessFactor !== undefined)
                  {
                      sheenRoughnessFactor = this.extensions.KHR_materials_sheen.sheenRoughnessFactor;
                  }
                  if(this.extensions.KHR_materials_sheen.sheenColorFactor !== undefined)
                  {
                      sheenColorFactor = jsToGl(this.extensions.KHR_materials_sheen.sheenColorFactor);
                  }
                  if (this.sheenRoughnessTexture !== undefined)
                  {
                      this.sheenRoughnessTexture.samplerName = "u_sheenRoughnessSampler";
                      this.parseTextureInfoExtensions(this.sheenRoughnessTexture, "SheenRoughness");
                      this.textures.push(this.sheenRoughnessTexture);
                      this.defines.push("HAS_SHEEN_ROUGHNESS_MAP 1");
                      this.properties.set("u_SheenRoughnessUVSet", this.sheenRoughnessTexture.texCoord);
                  }
                  if (this.sheenColorTexture !== undefined)
                  {
                      this.sheenColorTexture.samplerName = "u_SheenColorSampler";
                      this.parseTextureInfoExtensions(this.sheenColorTexture, "SheenColor");
                      this.textures.push(this.sheenColorTexture);
                      this.defines.push("HAS_SHEEN_COLOR_MAP 1");
                      this.properties.set("u_SheenColorUVSet", this.sheenColorTexture.texCoord);
                  }

                  this.properties.set("u_SheenRoughnessFactor", sheenRoughnessFactor);
                  this.properties.set("u_SheenColorFactor", sheenColorFactor);
              }

              // KHR Extension: Specular
              if (this.extensions.KHR_materials_specular !== undefined)
              {
                  this.hasSpecular = true;

                  if (this.specularTexture !== undefined)
                  {
                      this.specularTexture.samplerName = "u_SpecularSampler";
                      this.parseTextureInfoExtensions(this.specularTexture, "Specular");
                      this.textures.push(this.specularTexture);
                      this.defines.push("HAS_SPECULAR_MAP 1");
                      this.properties.set("u_SpecularUVSet", this.specularTexture.texCoord);
                  }

                  if (this.specularColorTexture !== undefined)
                  {
                      this.specularColorTexture.samplerName = "u_SpecularColorSampler";
                      this.parseTextureInfoExtensions(this.specularColorTexture, "SpecularColor");
                      this.textures.push(this.specularColorTexture);
                      this.defines.push("HAS_SPECULAR_COLOR_MAP 1");
                      this.properties.set("u_SpecularColorUVSet", this.specularColorTexture.texCoord);
                  }

                  let specularColorFactor = jsToGl(this.extensions.KHR_materials_specular.specularColorFactor ?? [1.0, 1.0, 1.0]);
                  let specularFactor = this.extensions.KHR_materials_specular.specularFactor ?? 1.0;

                  this.properties.set("u_KHR_materials_specular_specularColorFactor", specularColorFactor);
                  this.properties.set("u_KHR_materials_specular_specularFactor", specularFactor);
              }

              // KHR Extension: Transmission
              if (this.extensions.KHR_materials_transmission !== undefined)
              {
                  let transmissionFactor = 0.0;

                  this.hasTransmission = true;

                  if (transmissionFactor !== undefined)
                  {
                      transmissionFactor = this.extensions.KHR_materials_transmission.transmissionFactor;
                  }
                  if (this.transmissionTexture !== undefined)
                  {
                      this.transmissionTexture.samplerName = "u_TransmissionSampler";
                      this.parseTextureInfoExtensions(this.transmissionTexture, "Transmission");
                      this.textures.push(this.transmissionTexture);
                      this.defines.push("HAS_TRANSMISSION_MAP 1");
                      this.properties.set("u_TransmissionUVSet", this.transmissionTexture.texCoord);
                  }

                  this.properties.set("u_TransmissionFactor", transmissionFactor);
              }

              // KHR Extension: IOR
              //https://github.com/DassaultSystemes-Technology/glTF/tree/KHR_materials_ior/extensions/2.0/Khronos/KHR_materials_ior
              if (this.extensions.KHR_materials_ior !== undefined)
              {
                  let ior = 1.5;

                  this.hasIOR = true;
                  
                  if(this.extensions.KHR_materials_ior.ior !== undefined)
                  {
                      ior = this.extensions.KHR_materials_ior.ior;
                  }

                  this.properties.set("u_ior", ior);
              }

              // KHR Extension: Volume
              if (this.extensions.KHR_materials_volume !== undefined)
              {
                  this.hasVolume = true;

                  if (this.thicknessTexture !== undefined)
                  {
                      this.thicknessTexture.samplerName = "u_ThicknessSampler";
                      this.parseTextureInfoExtensions(this.thicknessTexture, "Thickness");
                      this.textures.push(this.thicknessTexture);
                      this.defines.push("HAS_THICKNESS_MAP 1");
                      this.properties.set("u_ThicknessUVSet", this.thicknessTexture.texCoord);
                  }

                  let attenuationColor = jsToGl(this.extensions.KHR_materials_volume.attenuationColor ?? [1.0, 1.0, 1.0]);
                  let attenuationDistance = this.extensions.KHR_materials_volume.attenuationDistance ?? 0.0;
                  let thicknessFactor = this.extensions.KHR_materials_volume.thicknessFactor ?? 0.0;

                  this.properties.set("u_AttenuationColor", attenuationColor);
                  this.properties.set("u_AttenuationDistance", attenuationDistance);
                  this.properties.set("u_ThicknessFactor", thicknessFactor);
              }
          }

          initGlForMembers(this, gltf, webGlContext);
      }

      fromJson(jsonMaterial)
      {
          super.fromJson(jsonMaterial);

          if (jsonMaterial.emissiveFactor !== undefined)
          {
              this.emissiveFactor = jsToGl(jsonMaterial.emissiveFactor);
          }

          if (jsonMaterial.normalTexture !== undefined)
          {
              const normalTexture = new gltfTextureInfo();
              normalTexture.fromJson(jsonMaterial.normalTexture);
              this.normalTexture = normalTexture;
          }

          if (jsonMaterial.occlusionTexture !== undefined)
          {
              const occlusionTexture = new gltfTextureInfo();
              occlusionTexture.fromJson(jsonMaterial.occlusionTexture);
              this.occlusionTexture = occlusionTexture;
          }

          if (jsonMaterial.emissiveTexture !== undefined)
          {
              const emissiveTexture = new gltfTextureInfo(undefined, 0, false);
              emissiveTexture.fromJson(jsonMaterial.emissiveTexture);
              this.emissiveTexture = emissiveTexture;
          }

          if(jsonMaterial.extensions !== undefined)
          {
              this.fromJsonMaterialExtensions(jsonMaterial.extensions);
          }

          if (jsonMaterial.pbrMetallicRoughness !== undefined && this.type !== "SG")
          {
              this.type = "MR";
              this.fromJsonMetallicRoughness(jsonMaterial.pbrMetallicRoughness);
          }
      }

      fromJsonMaterialExtensions(jsonExtensions)
      {
          if (jsonExtensions.KHR_materials_pbrSpecularGlossiness !== undefined)
          {
              this.type = "SG";
              this.fromJsonSpecularGlossiness(jsonExtensions.KHR_materials_pbrSpecularGlossiness);
          }

          if(jsonExtensions.KHR_materials_unlit !== undefined)
          {
              this.type = "unlit";
          }

          if(jsonExtensions.KHR_materials_clearcoat !== undefined)
          {
              this.fromJsonClearcoat(jsonExtensions.KHR_materials_clearcoat);
          }

          if(jsonExtensions.KHR_materials_sheen !== undefined)
          {
              this.fromJsonSheen(jsonExtensions.KHR_materials_sheen);
          }

          if(jsonExtensions.KHR_materials_transmission !== undefined)
          {
              this.fromJsonTransmission(jsonExtensions.KHR_materials_transmission);
          }

          if(jsonExtensions.KHR_materials_specular !== undefined)
          {
              this.fromJsonSpecular(jsonExtensions.KHR_materials_specular);
          }

          if(jsonExtensions.KHR_materials_volume !== undefined)
          {
              this.fromJsonVolume(jsonExtensions.KHR_materials_volume);
          }
      }

      fromJsonMetallicRoughness(jsonMetallicRoughness)
      {
          if (jsonMetallicRoughness.baseColorTexture !== undefined)
          {
              const baseColorTexture = new gltfTextureInfo(undefined, 0, false);
              baseColorTexture.fromJson(jsonMetallicRoughness.baseColorTexture);
              this.baseColorTexture = baseColorTexture;
          }

          if (jsonMetallicRoughness.metallicRoughnessTexture !== undefined)
          {
              const metallicRoughnessTexture = new gltfTextureInfo();
              metallicRoughnessTexture.fromJson(jsonMetallicRoughness.metallicRoughnessTexture);
              this.metallicRoughnessTexture = metallicRoughnessTexture;
          }
      }

      fromJsonSpecularGlossiness(jsonSpecularGlossiness)
      {
          if (jsonSpecularGlossiness.diffuseTexture !== undefined)
          {
              const diffuseTexture = new gltfTextureInfo(undefined, 0, false);
              diffuseTexture.fromJson(jsonSpecularGlossiness.diffuseTexture);
              this.diffuseTexture = diffuseTexture;
          }

          if (jsonSpecularGlossiness.specularGlossinessTexture !== undefined)
          {
              const specularGlossinessTexture = new gltfTextureInfo(undefined, 0, false);
              specularGlossinessTexture.fromJson(jsonSpecularGlossiness.specularGlossinessTexture);
              this.specularGlossinessTexture = specularGlossinessTexture;
          }
      }

      fromJsonClearcoat(jsonClearcoat)
      {
          if(jsonClearcoat.clearcoatTexture !== undefined)
          {
              const clearcoatTexture = new gltfTextureInfo();
              clearcoatTexture.fromJson(jsonClearcoat.clearcoatTexture);
              this.clearcoatTexture = clearcoatTexture;
          }

          if(jsonClearcoat.clearcoatRoughnessTexture !== undefined)
          {
              const clearcoatRoughnessTexture =  new gltfTextureInfo();
              clearcoatRoughnessTexture.fromJson(jsonClearcoat.clearcoatRoughnessTexture);
              this.clearcoatRoughnessTexture = clearcoatRoughnessTexture;
          }

          if(jsonClearcoat.clearcoatNormalTexture !== undefined)
          {
              const clearcoatNormalTexture =  new gltfTextureInfo();
              clearcoatNormalTexture.fromJson(jsonClearcoat.clearcoatNormalTexture);
              this.clearcoatNormalTexture = clearcoatNormalTexture;
          }
      }

      fromJsonSheen(jsonSheen)
      {
          if(jsonSheen.sheenColorTexture !== undefined)
          {
              const sheenColorTexture = new gltfTextureInfo(undefined, 0, false);
              sheenColorTexture.fromJson(jsonSheen.sheenColorTexture);
              this.sheenColorTexture = sheenColorTexture;
          }
          if(jsonSheen.sheenRoughnessTexture !== undefined)
          {
              const sheenRoughnessTexture = new gltfTextureInfo();
              sheenRoughnessTexture.fromJson(jsonSheen.sheenRoughnessTexture);
              this.sheenRoughnessTexture = sheenRoughnessTexture;
          }
      }

      fromJsonTransmission(jsonTransmission)
      {
          if(jsonTransmission.transmissionTexture !== undefined)
          {
              const transmissionTexture = new gltfTextureInfo();
              transmissionTexture.fromJson(jsonTransmission.transmissionTexture);
              this.transmissionTexture = transmissionTexture;
          }
      }

      fromJsonSpecular(jsonSpecular)
      {
          if(jsonSpecular.specularTexture !== undefined)
          {
              const specularTexture = new gltfTextureInfo();
              specularTexture.fromJson(jsonSpecular.specularTexture);
              this.specularTexture = specularTexture;
          }

          if(jsonSpecular.specularTexture !== undefined)
          {
              const specularTexture = new gltfTextureInfo();
              specularTexture.fromJson(jsonSpecular.specularTexture);
              this.specularTexture = specularTexture;
          }
      }

      fromJsonVolume(jsonVolume)
      {
          if(jsonVolume.thicknessTexture !== undefined)
          {
              const thicknessTexture = new gltfTextureInfo();
              thicknessTexture.fromJson(jsonVolume.thicknessTexture);
              this.thicknessTexture = thicknessTexture;
          }
      }
  }

  class DracoDecoder {

      constructor(dracoLib) {
          if (!DracoDecoder.instance && dracoLib === undefined)
          {
              if (DracoDecoderModule === undefined)
              {
                  console.error('Failed to initalize DracoDecoder: draco library undefined');
                  return undefined;
              }
              else
              {
                  dracoLib = DracoDecoderModule;
              }
          }
          if (!DracoDecoder.instance)
          {
              DracoDecoder.instance = this;
              this.module = null;

              this.initializingPromise = new Promise(resolve => {
                  let dracoDecoderType = {};
                  dracoDecoderType['onModuleLoaded'] = dracoDecoderModule => {
                      this.module = dracoDecoderModule;
                      resolve();
                  };
                  dracoLib(dracoDecoderType);
              });
          }
          return DracoDecoder.instance;
      }

      async ready() {
          await this.initializingPromise;
          Object.freeze(DracoDecoder.instance);
      }

  }

  class gltfPrimitive extends GltfObject
  {
      constructor()
      {
          super();
          this.attributes = [];
          this.targets = [];
          this.indices = undefined;
          this.material = undefined;
          this.mode = GL.TRIANGLES;

          // non gltf
          this.glAttributes = [];
          this.defines = [];
          this.skip = true;
          this.hasWeights = false;
          this.hasJoints = false;
          this.hasNormals = false;
          this.hasTangents = false;
          this.hasTexcoord = false;
          this.hasColor = false;

          // The primitive centroid is used for depth sorting.
          this.centroid = undefined;
      }

      initGl(gltf, webGlContext)
      {
          // Use the default glTF material.
          if (this.material === undefined)
          {
              this.material = gltf.materials.length - 1;
          }

          initGlForMembers(this, gltf, webGlContext);

          const maxAttributes = webGlContext.getParameter(GL.MAX_VERTEX_ATTRIBS);

          // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes

          if (this.extensions !== undefined)
          {
              if (this.extensions.KHR_draco_mesh_compression !== undefined)
              {
                  const dracoDecoder = new DracoDecoder();
                  if (dracoDecoder !== undefined && Object.isFrozen(dracoDecoder))
                  {
                      let dracoGeometry = this.decodeDracoBufferToIntermediate(
                          this.extensions.KHR_draco_mesh_compression, gltf);
                      this.copyDataFromDecodedGeometry(gltf, dracoGeometry, this.attributes);
                  }
                  else
                  {
                      console.warn('Failed to load draco compressed mesh: DracoDecoder not initialized');
                  }
              }
          }

          // VERTEX ATTRIBUTES
          for (const attribute of Object.keys(this.attributes))
          {
              if(this.glAttributes.length >= maxAttributes)
              {
                  console.error("To many vertex attributes for this primitive, skipping " + attribute);
                  break;
              }

              const idx = this.attributes[attribute];
              switch (attribute)
              {
              case "POSITION":
                  this.skip = false;
                  this.glAttributes.push({ attribute: attribute, name: "a_Position", accessor: idx });
                  break;
              case "NORMAL":
                  this.hasNormals = true;
                  this.defines.push("HAS_NORMALS 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Normal", accessor: idx });
                  break;
              case "TANGENT":
                  this.hasTangents = true;
                  this.defines.push("HAS_TANGENTS 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Tangent", accessor: idx });
                  break;
              case "TEXCOORD_0":
                  this.hasTexcoord = true;
                  this.defines.push("HAS_UV_SET1 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_UV1", accessor: idx });
                  break;
              case "TEXCOORD_1":
                  this.hasTexcoord = true;
                  this.defines.push("HAS_UV_SET2 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_UV2", accessor: idx });
                  break;
              case "COLOR_0":
                  this.hasColor = true;
                  const accessor = gltf.accessors[idx];
                  this.defines.push("HAS_VERTEX_COLOR_" + accessor.type + " 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Color", accessor: idx });
                  break;
              case "JOINTS_0":
                  this.hasJoints = true;
                  this.defines.push("HAS_JOINT_SET1 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Joint1", accessor: idx });
                  break;
              case "WEIGHTS_0":
                  this.hasWeights = true;
                  this.defines.push("HAS_WEIGHT_SET1 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Weight1", accessor: idx });
                  break;
              case "JOINTS_1":
                  this.hasJoints = true;
                  this.defines.push("HAS_JOINT_SET2 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Joint2", accessor: idx });
                  break;
              case "WEIGHTS_1":
                  this.hasWeights = true;
                  this.defines.push("HAS_WEIGHT_SET2 1");
                  this.glAttributes.push({ attribute: attribute, name: "a_Weight2", accessor: idx });
                  break;
              default:
                  console.log("Unknown attribute: " + attribute);
              }
          }

          // MORPH TARGETS
          if (this.targets !== undefined)
          {
              let i = 0;
              for (const target of this.targets)
              {
                  if(this.glAttributes.length + 3 > maxAttributes)
                  {
                      console.error("To many vertex attributes for this primitive, skipping target " + i);
                      break;
                  }

                  for (const attribute of Object.keys(target))
                  {
                      const idx = target[attribute];

                      switch (attribute)
                      {
                      case "POSITION":
                          this.defines.push("HAS_TARGET_POSITION" + i + " 1");
                          this.glAttributes.push({ attribute: attribute, name: "a_Target_Position" + i, accessor: idx });
                          break;
                      case "NORMAL":
                          this.defines.push("HAS_TARGET_NORMAL" + i + " 1");
                          this.glAttributes.push({ attribute: attribute, name: "a_Target_Normal" + i, accessor: idx });
                          break;
                      case "TANGENT":
                          this.defines.push("HAS_TARGET_TANGENT" + i + " 1");
                          this.glAttributes.push({ attribute: attribute, name: "a_Target_Tangent" + i, accessor: idx });
                          break;
                      }
                  }

                  ++i;
              }
          }

          this.computeCentroid(gltf);
      }

      computeCentroid(gltf)
      {
          const positionsAccessor = gltf.accessors[this.attributes.POSITION];
          const positions = positionsAccessor.getTypedView(gltf);

          if(this.indices !== undefined)
          {
              // Primitive has indices.

              const indicesAccessor = gltf.accessors[this.indices];

              const indices = indicesAccessor.getTypedView(gltf);

              const acc = new Float32Array(3);

              for(let i = 0; i < indices.length; i++) {
                  const offset = 3 * indices[i];
                  acc[0] += positions[offset];
                  acc[1] += positions[offset + 1];
                  acc[2] += positions[offset + 2];
              }

              const centroid = new Float32Array([
                  acc[0] / indices.length,
                  acc[1] / indices.length,
                  acc[2] / indices.length,
              ]);

              this.centroid = centroid;
          }
          else
          {
              // Primitive does not have indices.

              const acc = new Float32Array(3);

              for(let i = 0; i < positions.length; i += 3) {
                  acc[0] += positions[i];
                  acc[1] += positions[i + 1];
                  acc[2] += positions[i + 2];
              }

              const positionVectors = positions.length / 3;

              const centroid = new Float32Array([
                  acc[0] / positionVectors,
                  acc[1] / positionVectors,
                  acc[2] / positionVectors,
              ]);

              this.centroid = centroid;
          }
      }

      getShaderIdentifier()
      {
          return "primitive.vert";
      }

      getDefines()
      {
          return this.defines;
      }

      fromJson(jsonPrimitive)
      {
          super.fromJson(jsonPrimitive);

          if(jsonPrimitive.extensions !== undefined)
          {
              this.fromJsonPrimitiveExtensions(jsonPrimitive.extensions);
          }
      }

      fromJsonPrimitiveExtensions(jsonExtensions)
      {
          if(jsonExtensions.KHR_materials_variants !== undefined)
          {
              this.fromJsonVariants(jsonExtensions.KHR_materials_variants);
          }
      }

      fromJsonVariants(jsonVariants)
      {
          if(jsonVariants.mappings !== undefined)
          {
              this.mappings = jsonVariants.mappings;
          }
      }

      copyDataFromDecodedGeometry(gltf, dracoGeometry, primitiveAttributes)
      {
          // indices
          let indexBuffer = dracoGeometry.index.array;
          this.loadBufferIntoGltf(indexBuffer, gltf, this.indices, 34963,
              "index buffer view");

          // Position
          if(dracoGeometry.attributes.POSITION !== undefined)
          {
              let positionBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.POSITION.array,
                  dracoGeometry.attributes.POSITION.componentType);
              this.loadBufferIntoGltf(positionBuffer, gltf, primitiveAttributes["POSITION"], 34962,
                  "position buffer view");
          }

          // Normal
          if(dracoGeometry.attributes.NORMAL !== undefined)
          {
              let normalBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.NORMAL.array,
                  dracoGeometry.attributes.NORMAL.componentType);
              this.loadBufferIntoGltf(normalBuffer, gltf, primitiveAttributes["NORMAL"], 34962,
                  "normal buffer view");
          }

          // TEXCOORD_0
          if(dracoGeometry.attributes.TEXCOORD_0 !== undefined)
          {
              let uvBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.TEXCOORD_0.array,
                  dracoGeometry.attributes.TEXCOORD_0.componentType);
              this.loadBufferIntoGltf(uvBuffer, gltf, primitiveAttributes["TEXCOORD_0"], 34962,
                  "TEXCOORD_0 buffer view");
          }

          // TEXCOORD_1
          if(dracoGeometry.attributes.TEXCOORD_1 !== undefined)
          {
              let uvBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.TEXCOORD_1.array,
                  dracoGeometry.attributes.TEXCOORD_1.componentType);
              this.loadBufferIntoGltf(uvBuffer, gltf, primitiveAttributes["TEXCOORD_1"], 34962,
                  "TEXCOORD_1 buffer view");
          }

          // Tangent
          if(dracoGeometry.attributes.TANGENT !== undefined)
          {
              let tangentBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.TANGENT.array,
                  dracoGeometry.attributes.TANGENT.componentType);
              this.loadBufferIntoGltf(tangentBuffer, gltf, primitiveAttributes["TANGENT"], 34962,
                  "Tangent buffer view");
          }

          // Color
          if(dracoGeometry.attributes.COLOR_0 !== undefined)
          {
              let colorBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.COLOR_0.array,
                  dracoGeometry.attributes.COLOR_0.componentType);
              this.loadBufferIntoGltf(colorBuffer, gltf, primitiveAttributes["COLOR_0"], 34962,
                  "color buffer view");
          }

          // JOINTS_0
          if(dracoGeometry.attributes.JOINTS_0 !== undefined)
          {
              let jointsBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.JOINTS_0.array,
                  dracoGeometry.attributes.JOINTS_0.componentType);
              this.loadBufferIntoGltf(jointsBuffer, gltf, primitiveAttributes["JOINTS_0"], 34963,
                  "JOINTS_0 buffer view");
          }

          // WEIGHTS_0
          if(dracoGeometry.attributes.WEIGHTS_0 !== undefined)
          {
              let weightsBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.WEIGHTS_0.array,
                  dracoGeometry.attributes.WEIGHTS_0.componentType);
              this.loadBufferIntoGltf(weightsBuffer, gltf, primitiveAttributes["WEIGHTS_0"], 34963,
                  "WEIGHTS_0 buffer view");
          }

          // JOINTS_1
          if(dracoGeometry.attributes.JOINTS_1 !== undefined)
          {
              let jointsBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.JOINTS_1.array,
                  dracoGeometry.attributes.JOINTS_1.componentType);
              this.loadBufferIntoGltf(jointsBuffer, gltf, primitiveAttributes["JOINTS_1"], 34963,
                  "JOINTS_1 buffer view");
          }

          // WEIGHTS_1
          if(dracoGeometry.attributes.WEIGHTS_1 !== undefined)
          {
              let weightsBuffer = this.loadArrayIntoArrayBuffer(dracoGeometry.attributes.WEIGHTS_1.array,
                  dracoGeometry.attributes.WEIGHTS_1.componentType);
              this.loadBufferIntoGltf(weightsBuffer, gltf, primitiveAttributes["WEIGHTS_1"], 34963,
                  "WEIGHTS_1 buffer view");
          }
      }

      loadBufferIntoGltf(buffer, gltf, gltfAccessorIndex, gltfBufferViewTarget, gltfBufferViewName)
      {
          const gltfBufferObj = new gltfBuffer();
          gltfBufferObj.byteLength = buffer.byteLength;
          gltfBufferObj.buffer = buffer;
          gltf.buffers.push(gltfBufferObj);

          const gltfBufferViewObj = new gltfBufferView();
          gltfBufferViewObj.buffer = gltf.buffers.length - 1;
          gltfBufferViewObj.byteLength = buffer.byteLength;
          if(gltfBufferViewName !== undefined)
          {
              gltfBufferViewObj.name = gltfBufferViewName;
          }
          gltfBufferViewObj.target = gltfBufferViewTarget;
          gltf.bufferViews.push(gltfBufferViewObj);

          gltf.accessors[gltfAccessorIndex].byteOffset = 0;
          gltf.accessors[gltfAccessorIndex].bufferView = gltf.bufferViews.length - 1;
      }

      loadArrayIntoArrayBuffer(arrayData, componentType)
      {
          let arrayBuffer;
          switch (componentType)
          {
          case "Int8Array":
              arrayBuffer = new ArrayBuffer(arrayData.length);
              let int8Array = new Int8Array(arrayBuffer);
              int8Array.set(arrayData);
              break;
          case "Uint8Array":
              arrayBuffer = new ArrayBuffer(arrayData.length);
              let uint8Array = new Uint8Array(arrayBuffer);
              uint8Array.set(arrayData);
              break;
          case "Int16Array":
              arrayBuffer = new ArrayBuffer(arrayData.length * 2);
              let int16Array = new Int16Array(arrayBuffer);
              int16Array.set(arrayData);
              break;
          case "Uint16Array":
              arrayBuffer = new ArrayBuffer(arrayData.length * 2);
              let uint16Array = new Uint16Array(arrayBuffer);
              uint16Array.set(arrayData);
              break;
          case "Int32Array":
              arrayBuffer = new ArrayBuffer(arrayData.length * 4);
              let int32Array = new Int32Array(arrayBuffer);
              int32Array.set(arrayData);
              break;
          case "Uint32Array":
              arrayBuffer = new ArrayBuffer(arrayData.length * 4);
              let uint32Array = new Uint32Array(arrayBuffer);
              uint32Array.set(arrayData);
              break;
          default:
          case "Float32Array":
              arrayBuffer = new ArrayBuffer(arrayData.length * 4);
              let floatArray = new Float32Array(arrayBuffer);
              floatArray.set(arrayData);
              break;
          }


          return arrayBuffer;
      }

      decodeDracoBufferToIntermediate(dracoExtension, gltf)
      {
          let dracoBufferViewIDX = dracoExtension.bufferView;

          const origGltfDrBufViewObj = gltf.bufferViews[dracoBufferViewIDX];
          const origGltfDracoBuffer = gltf.buffers[origGltfDrBufViewObj.buffer];

          const totalBuffer = new Int8Array( origGltfDracoBuffer.buffer );
          const actualBuffer = totalBuffer.slice(origGltfDrBufViewObj.byteOffset,
              origGltfDrBufViewObj.byteOffset + origGltfDrBufViewObj.byteLength);

          // decode draco buffer to geometry intermediate
          let dracoDecoder = new DracoDecoder();
          let draco = dracoDecoder.module;
          let decoder = new draco.Decoder();
          let decoderBuffer = new draco.DecoderBuffer();
          decoderBuffer.Init(actualBuffer, origGltfDrBufViewObj.byteLength);
          let geometry = this.decodeGeometry( draco, decoder, decoderBuffer, dracoExtension.attributes, gltf );

          draco.destroy( decoderBuffer );

          return geometry;
      }

      getDracoArrayTypeFromComponentType(componentType)
      {
          switch (componentType)
          {
          case GL.BYTE:
              return "Int8Array";
          case GL.UNSIGNED_BYTE:
              return "Uint8Array";
          case GL.SHORT:
              return "Int16Array";
          case GL.UNSIGNED_SHORT:
              return "Uint16Array";
          case GL.INT:
              return "Int32Array";
          case GL.UNSIGNED_INT:
              return "Uint32Array";
          case GL.FLOAT:
              return "Float32Array";
          default:
              return "Float32Array";
          }
      }

      decodeGeometry(draco, decoder, decoderBuffer, gltfDracoAttributes, gltf) {
          let dracoGeometry;
          let decodingStatus;

          // decode mesh in draco decoder
          let geometryType = decoder.GetEncodedGeometryType( decoderBuffer );
          if ( geometryType === draco.TRIANGULAR_MESH ) {
              dracoGeometry = new draco.Mesh();
              decodingStatus = decoder.DecodeBufferToMesh( decoderBuffer, dracoGeometry );
          }
          else
          {
              throw new Error( 'DRACOLoader: Unexpected geometry type.' );
          }

          if ( ! decodingStatus.ok() || dracoGeometry.ptr === 0 ) {
              throw new Error( 'DRACOLoader: Decoding failed: ' + decodingStatus.error_msg() );
          }

          let geometry = { index: null, attributes: {} };
          let vertexCount = dracoGeometry.num_points();

          // Gather all vertex attributes.
          for(let dracoAttr in gltfDracoAttributes)
          {
              let componentType = GL.BYTE;
              let accessotVertexCount;
              // find gltf accessor for this draco attribute
              for (const [key, value] of Object.entries(this.attributes))
              {
                  if(key === dracoAttr)
                  {
                      componentType = gltf.accessors[value].componentType;
                      accessotVertexCount = gltf.accessors[value].count;
                      break;
                  }
              }

              // check if vertex count matches
              if(vertexCount !== accessotVertexCount)
              {
                  throw new Error(`DRACOLoader: Accessor vertex count ${accessotVertexCount} does not match draco decoder vertex count  ${vertexCount}`);
              }
              componentType = this.getDracoArrayTypeFromComponentType(componentType);

              let dracoAttribute = decoder.GetAttributeByUniqueId( dracoGeometry, gltfDracoAttributes[dracoAttr]);
              var tmpObj = this.decodeAttribute( draco, decoder,
                  dracoGeometry, dracoAttr, dracoAttribute, componentType);
              geometry.attributes[tmpObj.name] = tmpObj;
          }

          // Add index buffer
          if ( geometryType === draco.TRIANGULAR_MESH ) {

              // Generate mesh faces.
              let numFaces = dracoGeometry.num_faces();
              let numIndices = numFaces * 3;
              let dataSize = numIndices * 4;
              let ptr = draco._malloc( dataSize );
              decoder.GetTrianglesUInt32Array( dracoGeometry, dataSize, ptr );
              let index = new Uint32Array( draco.HEAPU32.buffer, ptr, numIndices ).slice();
              draco._free( ptr );

              geometry.index = { array: index, itemSize: 1 };

          }

          draco.destroy( dracoGeometry );
          return geometry;
      }

      decodeAttribute( draco, decoder, dracoGeometry, attributeName, attribute, attributeType) {
          let numComponents = attribute.num_components();
          let numPoints = dracoGeometry.num_points();
          let numValues = numPoints * numComponents;

          let ptr;
          let array;

          let dataSize;
          switch ( attributeType ) {
          case "Float32Array":
              dataSize = numValues * 4;
              ptr = draco._malloc( dataSize );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_FLOAT32, dataSize, ptr );
              array = new Float32Array( draco.HEAPF32.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          case "Int8Array":
              ptr = draco._malloc( numValues );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_INT8, numValues, ptr );
              array = new Int8Array( draco.HEAP8.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          case "Int16Array":
              dataSize = numValues * 2;
              ptr = draco._malloc( dataSize );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_INT16, dataSize, ptr );
              array = new Int16Array( draco.HEAP16.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          case "Int32Array":
              dataSize = numValues * 4;
              ptr = draco._malloc( dataSize );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_INT32, dataSize, ptr );
              array = new Int32Array( draco.HEAP32.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          case "Uint8Array":
              ptr = draco._malloc( numValues );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_UINT8, numValues, ptr );
              array = new Uint8Array( draco.HEAPU8.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          case "Uint16Array":
              dataSize = numValues * 2;
              ptr = draco._malloc( dataSize );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_UINT16, dataSize, ptr );
              array = new Uint16Array( draco.HEAPU16.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          case "Uint32Array":
              dataSize = numValues * 4;
              ptr = draco._malloc( dataSize );
              decoder.GetAttributeDataArrayForAllPoints( dracoGeometry, attribute, draco.DT_UINT32, dataSize, ptr );
              array = new Uint32Array( draco.HEAPU32.buffer, ptr, numValues ).slice();
              draco._free( ptr );
              break;

          default:
              throw new Error( 'DRACOLoader: Unexpected attribute type.' );
          }

          return {
              name: attributeName,
              array: array,
              itemSize: numComponents,
              componentType: attributeType
          };

      }
  }

  class gltfMesh extends GltfObject
  {
      constructor()
      {
          super();
          this.primitives = [];
          this.name = undefined;
          this.weights = [];

          // non gltf
          this.weightsAnimated = undefined;
      }

      fromJson(jsonMesh)
      {
          super.fromJson(jsonMesh);

          if (jsonMesh.name !== undefined)
          {
              this.name = jsonMesh.name;
          }

          this.primitives = objectsFromJsons(jsonMesh.primitives, gltfPrimitive);

          if(jsonMesh.weights !== undefined)
          {
              this.weights = jsonMesh.weights;
          }
      }

      getWeightsAnimated()
      {
          return this.weightsAnimated !== undefined ? this.weightsAnimated : this.weights;
      }
  }

  // contain:
  // transform
  // child indices (reference to scene array of nodes)

  class gltfNode extends GltfObject
  {
      constructor()
      {
          super();
          this.camera = undefined;
          this.children = [];
          this.matrix = undefined;
          this.rotation = jsToGl([0, 0, 0, 1]);
          this.scale = jsToGl([1, 1, 1]);
          this.translation = jsToGl([0, 0, 0]);
          this.name = undefined;
          this.mesh = undefined;
          this.skin = undefined;

          // non gltf
          this.worldTransform = create$1();
          this.inverseWorldTransform = create$1();
          this.normalMatrix = create$1();
          this.light = undefined;
          this.changed = true;

          this.animationRotation = undefined;
          this.animationTranslation = undefined;
          this.animationScale = undefined;
      }

      initGl()
      {
          if (this.matrix !== undefined)
          {
              this.applyMatrix(this.matrix);
          }
          else
          {
              if (this.scale !== undefined)
              {
                  this.scale = jsToGl(this.scale);
              }

              if (this.rotation !== undefined)
              {
                  this.rotation = jsToGl(this.rotation);
              }

              if (this.translation !== undefined)
              {
                  this.translation = jsToGl(this.translation);
              }
          }
          this.changed = true;
      }

      applyMatrix(matrixData)
      {
          this.matrix = jsToGl(matrixData);

          getScaling(this.scale, this.matrix);

          // To extract a correct rotation, the scaling component must be eliminated.
          const mn = create$1();
          for(const col of [0, 1, 2])
          {
              mn[col] = this.matrix[col] / this.scale[0];
              mn[col + 4] = this.matrix[col + 4] / this.scale[1];
              mn[col + 8] = this.matrix[col + 8] / this.scale[2];
          }
          getRotation(this.rotation, mn);
          normalize$2(this.rotation, this.rotation);

          getTranslation(this.translation, this.matrix);

          this.changed = true;
      }

      // vec3
      applyTranslationAnimation(translation)
      {
          this.animationTranslation = translation;
          this.changed = true;
      }

      // quat
      applyRotationAnimation(rotation)
      {
          this.animationRotation = rotation;
          this.changed = true;
      }

      // vec3
      applyScaleAnimation(scale)
      {
          this.animationScale = scale;
          this.changed = true;
      }

      resetTransform()
      {
          this.rotation = jsToGl([0, 0, 0, 1]);
          this.scale = jsToGl([1, 1, 1]);
          this.translation = jsToGl([0, 0, 0]);
          this.changed = true;
      }

      getLocalTransform()
      {
          if(this.transform === undefined || this.changed)
          {
              this.transform = create$1();
              const translation = this.animationTranslation !== undefined ? this.animationTranslation : this.translation;
              const rotation = this.animationRotation !== undefined ? this.animationRotation : this.rotation;
              const scale = this.animationScale !== undefined ? this.animationScale : this.scale;
              fromRotationTranslationScale(this.transform, rotation, translation, scale);
              this.changed = false;
          }

          return clone(this.transform);
      }
  }

  class gltfSampler extends GltfObject
  {
      constructor(
          magFilter = GL.LINEAR,
          minFilter = GL.LINEAR_MIPMAP_LINEAR,
          wrapS = GL.REPEAT,
          wrapT = GL.REPEAT)
      {
          super();
          this.magFilter = magFilter;
          this.minFilter = minFilter;
          this.wrapS = wrapS;
          this.wrapT = wrapT;
          this.name = undefined;
      }

      static createDefault()
      {
          return new gltfSampler();
      }
  }

  class gltfScene extends GltfObject
  {
      constructor(nodes = [], name = undefined)
      {
          super();
          this.nodes = nodes;
          this.name = name;

          // non gltf
          this.imageBasedLight = undefined;
      }

      initGl(gltf, webGlContext)
      {
          super.initGl(gltf, webGlContext);

          if (this.extensions !== undefined &&
              this.extensions.KHR_lights_image_based !== undefined)
          {
              const index = this.extensions.KHR_lights_image_based.imageBasedLight;
              this.imageBasedLight = gltf.imageBasedLights[index];
          }
      }

      applyTransformHierarchy(gltf, rootTransform = create$1())
      {
          function applyTransform(gltf, node, parentTransform)
          {
              multiply$1(node.worldTransform, parentTransform, node.getLocalTransform());
              invert(node.inverseWorldTransform, node.worldTransform);
              transpose(node.normalMatrix, node.inverseWorldTransform);

              for (const child of node.children)
              {
                  applyTransform(gltf, gltf.nodes[child], node.worldTransform);
              }
          }

          for (const node of this.nodes)
          {
              applyTransform(gltf, gltf.nodes[node], rootTransform);
          }
      }

      gatherNodes(gltf)
      {
          const nodes = [];

          function gatherNode(nodeIndex)
          {
              const node = gltf.nodes[nodeIndex];
              nodes.push(node);

              // recurse into children
              for(const child of node.children)
              {
                  gatherNode(child);
              }
          }

          for (const node of this.nodes)
          {
              gatherNode(node);
          }

          return nodes;
      }

      includesNode(gltf, nodeIndex)
      {
          let children = [...this.nodes];
          while(children.length > 0)
          {
              const childIndex = children.pop();

              if (childIndex === nodeIndex)
              {
                  return true;
              }

              children = children.concat(gltf.nodes[childIndex].children);
          }

          return false;
      }
  }

  class gltfAsset extends GltfObject
  {
      constructor()
      {
          super();
          this.copyright = undefined;
          this.generator = undefined;
          this.version = undefined;
          this.minVersion = undefined;
      }
  }

  class gltfAnimationChannel extends GltfObject
  {
      constructor()
      {
          super();
          this.target = {node: undefined, path: undefined};
          this.sampler = undefined;
      }
  }

  const InterpolationPath =
  {
      TRANSLATION: "translation",
      ROTATION: "rotation",
      SCALE: "scale",
      WEIGHTS: "weights"
  };

  class gltfAnimationSampler extends GltfObject
  {
      constructor()
      {
          super();
          this.input = undefined;
          this.interpolation = undefined;
          this.output = undefined;
      }
  }

  const InterpolationModes =
  {
      LINEAR: "LINEAR",
      STEP: "STEP",
      CUBICSPLINE: "CUBICSPLINE"
  };

  class gltfInterpolator
  {
      constructor()
      {
          this.prevKey = 0;
          this.prevT = 0.0;
      }

      slerpQuat(q1, q2, t)
      {
          const qn1 = create$4();
          const qn2 = create$4();

          normalize$2(qn1, q1);
          normalize$2(qn2, q2);

          const quatResult = create$4();

          slerp(quatResult, qn1, qn2, t);
          normalize$2(quatResult, quatResult);

          return quatResult;
      }

      step(prevKey, output, stride)
      {
          const result = new ARRAY_TYPE(stride);

          for(let i = 0; i < stride; ++i)
          {
              result[i] = output[prevKey * stride + i];
          }

          return result;
      }

      linear(prevKey, nextKey, output, t, stride)
      {
          const result = new ARRAY_TYPE(stride);

          for(let i = 0; i < stride; ++i)
          {
              result[i] = output[prevKey * stride + i] * (1-t) + output[nextKey * stride + i] * t;
          }

          return result;
      }

      cubicSpline(prevKey, nextKey, output, keyDelta, t, stride)
      {
          // stride: Count of components (4 in a quaternion).
          // Scale by 3, because each output entry consist of two tangents and one data-point.
          const prevIndex = prevKey * stride * 3;
          const nextIndex = nextKey * stride * 3;
          const A = 0;
          const V = 1 * stride;
          const B = 2 * stride;

          const result = new ARRAY_TYPE(stride);
          const tSq = t ** 2;
          const tCub = t ** 3;

          // We assume that the components in output are laid out like this: in-tangent, point, out-tangent.
          // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#appendix-c-spline-interpolation
          for(let i = 0; i < stride; ++i)
          {
              const v0 = output[prevIndex + i + V];
              const a = keyDelta * output[nextIndex + i + A];
              const b = keyDelta * output[prevIndex + i + B];
              const v1 = output[nextIndex + i + V];

              result[i] = ((2*tCub - 3*tSq + 1) * v0) + ((tCub - 2*tSq + t) * b) + ((-2*tCub + 3*tSq) * v1) + ((tCub - tSq) * a);
          }

          return result;
      }

      resetKey()
      {
          this.prevKey = 0;
      }

      interpolate(gltf, channel, sampler, t, stride, maxTime)
      {
          if(t === undefined)
          {
              return undefined;
          }

          const input = gltf.accessors[sampler.input].getNormalizedDeinterlacedView(gltf);
          const output = gltf.accessors[sampler.output].getNormalizedDeinterlacedView(gltf);

          if(output.length === stride) // no interpolation for single keyFrame animations
          {
              return jsToGlSlice(output, 0, stride);
          }

          // Wrap t around, so the animation loops.
          // Make sure that t is never earlier than the first keyframe and never later then the last keyframe.
          t = t % maxTime;
          t = clamp(t, input[0], input[input.length - 1]);

          if (this.prevT > t)
          {
              this.prevKey = 0;
          }

          this.prevT = t;

          // Find next keyframe: min{ t of input | t > prevKey }
          let nextKey = null;
          for (let i = this.prevKey; i < input.length; ++i)
          {
              if (t <= input[i])
              {
                  nextKey = clamp(i, 1, input.length - 1);
                  break;
              }
          }
          this.prevKey = clamp(nextKey - 1, 0, nextKey);

          const keyDelta = input[nextKey] - input[this.prevKey];

          // Normalize t: [t0, t1] -> [0, 1]
          const tn = (t - input[this.prevKey]) / keyDelta;

          if(channel.target.path === InterpolationPath.ROTATION)
          {

              if(InterpolationModes.CUBICSPLINE === sampler.interpolation)
              {
                  // GLTF requires cubic spline interpolation for quaternions.
                  // https://github.com/KhronosGroup/glTF/issues/1386
                  const result = this.cubicSpline(this.prevKey, nextKey, output, keyDelta, tn, 4);
                  normalize$2(result, result);
                  return result;
              }
              else if(sampler.interpolation === InterpolationModes.LINEAR)
              {
                  const q0 = this.getQuat(output, this.prevKey);
                  const q1 = this.getQuat(output, nextKey);
                  return this.slerpQuat(q0, q1, tn);
              }
              else if(sampler.interpolation === InterpolationModes.STEP)
              {
                  return this.getQuat(output, this.prevKey);
              }

          }

          switch(sampler.interpolation)
          {
          case InterpolationModes.STEP:
              return this.step(this.prevKey, output, stride);
          case InterpolationModes.CUBICSPLINE:
              return this.cubicSpline(this.prevKey, nextKey, output, keyDelta, tn, stride);
          default:
              return this.linear(this.prevKey, nextKey, output, tn, stride);
          }
      }

      getQuat(output, index)
      {
          const x = output[4 * index];
          const y = output[4 * index + 1];
          const z = output[4 * index + 2];
          const w = output[4 * index + 3];
          return fromValues$2(x, y, z, w);
      }
  }

  class gltfAnimation extends GltfObject
  {
      constructor()
      {
          super();
          this.channels = [];
          this.samplers = [];
          this.name = '';

          // not gltf
          this.interpolators = [];
          this.maxTime = 0;
          this.disjointAnimations = [];
      }

      fromJson(jsonAnimation)
      {
          super.fromJson(jsonAnimation);

          this.channels = objectsFromJsons(jsonAnimation.channels, gltfAnimationChannel);
          this.samplers = objectsFromJsons(jsonAnimation.samplers, gltfAnimationSampler);
          this.name = jsonAnimation.name;

          if(this.channels === undefined)
          {
              console.error("No channel data found for skin");
              return;
          }

          for(let i = 0; i < this.channels.length; ++i)
          {
              this.interpolators.push(new gltfInterpolator());
          }
      }

      // advance the animation, if totalTime is undefined, the animation is deactivated
      advance(gltf, totalTime)
      {
          if(this.channels === undefined)
          {
              return;
          }

          if(this.maxTime == 0)
          {
              for(let i = 0; i < this.channels.length; ++i)
              {
                  const channel = this.channels[i];
                  const sampler = this.samplers[channel.sampler];
                  const input = gltf.accessors[sampler.input].getDeinterlacedView(gltf);
                  const max = input[input.length - 1];
                  if(max > this.maxTime)
                  {
                      this.maxTime = max;
                  }
              }
          }

          for(let i = 0; i < this.interpolators.length; ++i)
          {
              const channel = this.channels[i];
              const sampler = this.samplers[channel.sampler];
              const interpolator = this.interpolators[i];

              const node = gltf.nodes[channel.target.node];

              switch(channel.target.path)
              {
              case InterpolationPath.TRANSLATION:
                  node.applyTranslationAnimation(interpolator.interpolate(gltf, channel, sampler, totalTime, 3, this.maxTime));
                  break;
              case InterpolationPath.ROTATION:
                  node.applyRotationAnimation(interpolator.interpolate(gltf, channel, sampler, totalTime, 4, this.maxTime));
                  break;
              case InterpolationPath.SCALE:
                  node.applyScaleAnimation(interpolator.interpolate(gltf, channel, sampler, totalTime, 3, this.maxTime));
                  break;
              case InterpolationPath.WEIGHTS:
              {
                  const mesh = gltf.meshes[node.mesh];
                  mesh.weightsAnimated = interpolator.interpolate(gltf, channel, sampler, totalTime, mesh.weights.length, this.maxTime);
                  break;
              }
              }
          }
      }
  }

  class gltfSkin extends GltfObject
  {
      constructor()
      {
          super();

          this.name = "";
          this.inverseBindMatrices = undefined;
          this.joints = [];
          this.skeleton = undefined;

          // not gltf
          this.jointMatrices = [];
          this.jointNormalMatrices = [];
      }

      computeJoints(gltf, parentNode)
      {
          const ibmAccessor = gltf.accessors[this.inverseBindMatrices].getDeinterlacedView(gltf);
          this.jointMatrices = [];
          this.jointNormalMatrices = [];

          let i = 0;
          for(const joint of this.joints)
          {
              const node = gltf.nodes[joint];

              let jointMatrix = create$1();
              let ibm = jsToGlSlice(ibmAccessor, i++ * 16, 16);
              mul(jointMatrix, node.worldTransform, ibm);
              mul(jointMatrix, parentNode.inverseWorldTransform, jointMatrix);
              this.jointMatrices.push(jointMatrix);

              let normalMatrix = create$1();
              invert(normalMatrix, jointMatrix);
              transpose(normalMatrix, normalMatrix);
              this.jointNormalMatrices.push(normalMatrix);
          }
      }
  }

  class gltfVariant extends GltfObject
  {
      constructor()
      {
          super();
          this.name = undefined;
      }

      fromJson(jsonVariant)
      {
          if(jsonVariant.name !== undefined)
          {
              this.name = jsonVariant.name;
          }
      }
  }

  class glTF extends GltfObject
  {
      constructor(file)
      {
          super();
          this.asset = undefined;
          this.accessors = [];
          this.nodes = [];
          this.scene = undefined; // the default scene to show.
          this.scenes = [];
          this.cameras = [];
          this.lights = [];
          this.imageBasedLights = [];
          this.textures = [];
          this.images = [];
          this.samplers = [];
          this.meshes = [];
          this.buffers = [];
          this.bufferViews = [];
          this.materials = [];
          this.animations = [];
          this.skins = [];
          this.path = file;
      }

      initGl(webGlContext)
      {
          initGlForMembers(this, this, webGlContext);
      }

      fromJson(json)
      {
          super.fromJson(json);

          this.asset = objectFromJson(json.asset, gltfAsset);
          this.cameras = objectsFromJsons(json.cameras, gltfCamera);
          this.accessors = objectsFromJsons(json.accessors, gltfAccessor);
          this.meshes = objectsFromJsons(json.meshes, gltfMesh);
          this.samplers = objectsFromJsons(json.samplers, gltfSampler);
          this.materials = objectsFromJsons(json.materials, gltfMaterial);
          this.buffers = objectsFromJsons(json.buffers, gltfBuffer);
          this.bufferViews = objectsFromJsons(json.bufferViews, gltfBufferView);
          this.scenes = objectsFromJsons(json.scenes, gltfScene);
          this.textures = objectsFromJsons(json.textures, gltfTexture);
          this.nodes = objectsFromJsons(json.nodes, gltfNode);
          this.lights = objectsFromJsons(getJsonLightsFromExtensions(json.extensions), gltfLight);
          this.imageBasedLights = objectsFromJsons(getJsonIBLsFromExtensions(json.extensions), ImageBasedLight);
          this.images = objectsFromJsons(json.images, gltfImage);
          this.animations = objectsFromJsons(json.animations, gltfAnimation);
          this.skins = objectsFromJsons(json.skins, gltfSkin);
          this.variants = objectsFromJsons(getJsonVariantsFromExtension(json.extensions), gltfVariant);
          this.variants = enforceVariantsUniqueness(this.variants);

          this.materials.push(gltfMaterial.createDefault());
          this.samplers.push(gltfSampler.createDefault());

          if (json.scenes !== undefined)
          {
              if (json.scene === undefined && json.scenes.length > 0)
              {
                  this.scene = 0;
              }
              else
              {
                  this.scene = json.scene;
              }
          }

          this.computeDisjointAnimations();
      }

      // Computes indices of animations which are disjoint and can be played simultaneously.
      computeDisjointAnimations()
      {
          for (let i = 0; i < this.animations.length; i++)
          {
              this.animations[i].disjointAnimations = [];

              for (let k = 0; k < this.animations.length; k++)
              {
                  if (i == k)
                  {
                      continue;
                  }

                  let isDisjoint = true;

                  for (const iChannel of this.animations[i].channels)
                  {
                      for (const kChannel of this.animations[k].channels)
                      {
                          if (iChannel.target.node === kChannel.target.node
                              && iChannel.target.path === kChannel.target.path)
                          {
                              isDisjoint = false;
                              break;
                          }
                      }
                  }

                  if (isDisjoint)
                  {
                      this.animations[i].disjointAnimations.push(k);
                  }
              }
          }
      }

      nonDisjointAnimations(animationIndices)
      {
          const animations = this.animations;
          const nonDisjointAnimations = [];

          for (let i = 0; i < animations.length; i++)
          {
              let isDisjoint = true;
              for (const k of animationIndices)
              {
                  if (i == k)
                  {
                      continue;
                  }

                  if (!animations[k].disjointAnimations.includes(i))
                  {
                      isDisjoint = false;
                  }
              }

              if (!isDisjoint)
              {
                  nonDisjointAnimations.push(i);
              }
          }

          return nonDisjointAnimations;
      }
  }

  function getJsonLightsFromExtensions(extensions)
  {
      if (extensions === undefined)
      {
          return [];
      }
      if (extensions.KHR_lights_punctual === undefined)
      {
          return [];
      }
      return extensions.KHR_lights_punctual.lights;
  }

  function getJsonIBLsFromExtensions(extensions)
  {
      if (extensions === undefined)
      {
          return [];
      }
      if (extensions.KHR_lights_image_based === undefined)
      {
          return [];
      }
      return extensions.KHR_lights_image_based.imageBasedLights;
  }

  function getJsonVariantsFromExtension(extensions)
  {
      if (extensions === undefined)
      {
          return [];
      }
      if (extensions.KHR_materials_variants === undefined)
      {
          return [];
      }
      return extensions.KHR_materials_variants.variants;
  }

  function enforceVariantsUniqueness(variants)
  {
      for(let i=0;i<variants.length;i++)
      {
          const name = variants[i].name;
          for(let j=i+1;j<variants.length;j++)
          {
              if(variants[j].name == name)
              {
                  variants[j].name += "0";  // Add random character to duplicates
              }
          }
      }


      return variants;
  }

  class GlbParser
  {
      constructor(data)
      {
          this.data = data;
          this.glbHeaderInts = 3;
          this.glbChunkHeaderInts = 2;
          this.glbMagic = 0x46546C67;
          this.glbVersion = 2;
          this.jsonChunkType = 0x4E4F534A;
          this.binaryChunkType = 0x004E4942;
      }

      extractGlbData()
      {
          const glbInfo = this.getCheckedGlbInfo();
          if (glbInfo === undefined)
          {
              return undefined;
          }

          let json = undefined;
          let buffers = [];
          const chunkInfos = this.getAllChunkInfos();
          for (let chunkInfo of chunkInfos)
          {
              if (chunkInfo.type == this.jsonChunkType && !json)
              {
                  json = this.getJsonFromChunk(chunkInfo);
              }
              else if (chunkInfo.type == this.binaryChunkType)
              {
                  buffers.push(this.getBufferFromChunk(chunkInfo));
              }
          }

          return { json: json, buffers: buffers };
      }

      getCheckedGlbInfo()
      {
          const header = new Uint32Array(this.data, 0, this.glbHeaderInts);
          const magic = header[0];
          const version = header[1];
          const length = header[2];

          if (!this.checkEquality(magic, this.glbMagic, "glb magic") ||
              !this.checkEquality(version, this.glbVersion, "glb header version") ||
              !this.checkEquality(length, this.data.byteLength, "glb byte length"))
          {
              return undefined;
          }

          return { "magic": magic, "version": version, "length": length };
      }

      getAllChunkInfos()
      {
          let infos = [];
          let chunkStart = this.glbHeaderInts * 4;
          while (chunkStart < this.data.byteLength)
          {
              const chunkInfo = this.getChunkInfo(chunkStart);
              infos.push(chunkInfo);
              chunkStart += chunkInfo.length + this.glbChunkHeaderInts * 4;
          }
          return infos;
      }

      getChunkInfo(headerStart)
      {
          const header = new Uint32Array(this.data, headerStart, this.glbChunkHeaderInts);
          const chunkStart = headerStart + this.glbChunkHeaderInts * 4;
          const chunkLength = header[0];
          const chunkType = header[1];
          return { "start": chunkStart, "length": chunkLength, "type": chunkType };
      }

      getJsonFromChunk(chunkInfo)
      {
          const chunkLength = chunkInfo.length;
          const jsonStart = (this.glbHeaderInts + this.glbChunkHeaderInts) * 4;
          const jsonSlice = new Uint8Array(this.data, jsonStart, chunkLength);
          const stringBuffer = new TextDecoder("utf-8").decode(jsonSlice);
          return JSON.parse(stringBuffer);
      }

      getBufferFromChunk(chunkInfo)
      {
          return this.data.slice(chunkInfo.start, chunkInfo.start + chunkInfo.length);
      }

      checkEquality(actual, expected, name)
      {
          if (actual == expected)
          {
              return true;
          }

          console.error("Found invalid/unsupported " + name + ", expected: " + expected + ", but was: " + actual);
          return false;
      }
  }

  class gltfLoader
  {
      static async load(gltf, webGlContext, appendix = undefined)
      {
          const buffers = gltfLoader.getBuffers(appendix);
          const additionalFiles = gltfLoader.getAdditionalFiles(appendix);

          const buffersPromise = gltfLoader.loadBuffers(gltf, buffers, additionalFiles);

          await buffersPromise; // images might be stored in the buffers
          const imagesPromise = gltfLoader.loadImages(gltf, additionalFiles);

          return await Promise.all([buffersPromise, imagesPromise])
              .then(() => gltf.initGl(webGlContext));
      }

      static unload(gltf)
      {
          for (let image of gltf.images)
          {
              image.image = undefined;
          }
          gltf.images = [];

          for (let texture of gltf.textures)
          {
              texture.destroy();
          }
          gltf.textures = [];

          for (let accessor of gltf.accessors)
          {
              accessor.destroy();
          }
          gltf.accessors = [];
      }

      static getBuffers(appendix)
      {
          return gltfLoader.getTypedAppendix(appendix, ArrayBuffer);
      }

      static getAdditionalFiles(appendix)
      {
          if(typeof(File) !== 'undefined')
          {
              return gltfLoader.getTypedAppendix(appendix, File);
          }
          else
          {
              return;
          }
      }

      static getTypedAppendix(appendix, Type)
      {
          if (appendix && appendix.length > 0)
          {
              if (appendix[0] instanceof Type)
              {
                  return appendix;
              }
          }
      }

      static loadBuffers(gltf, buffers, additionalFiles)
      {
          const promises = [];

          if (buffers !== undefined && buffers[0] !== undefined) //GLB
          {
              //There is only one buffer for the glb binary data 
              //see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#glb-file-format-specification
              if (buffers.length > 1)
              {
                  console.warn("Too many buffer chunks in GLB file. Only one or zero allowed");
              }

              gltf.buffers[0].buffer = buffers[0];
              for (let i = 1; i < gltf.buffers.length; ++i)
              {
                  promises.push(gltf.buffers[i].load(gltf, additionalFiles));
              }
          }
          else
          {
              for (const buffer of gltf.buffers)
              {
                  promises.push(buffer.load(gltf, additionalFiles));
              }
          }
          return Promise.all(promises);
      }

      static loadImages(gltf, additionalFiles)
      {
          const imagePromises = [];
          for (let image of gltf.images)
          {
              imagePromises.push(image.load(gltf, additionalFiles));
          }
          return Promise.all(imagePromises);
      }
  }

  var iblFiltering = "//#version 450\n//#extension GL_ARB_separate_shader_objects : enable\n\nprecision mediump float;\n#define GLSLIFY 1\n#define MATH_PI 3.1415926535897932384626433832795\n//#define MATH_INV_PI (1.0 / MATH_PI)\n\nuniform samplerCube uCubeMap;\n\n// enum\nconst int cLambertian = 0;\nconst int cGGX = 1;\nconst int cCharlie = 2;\n\n//layout(push_constant) uniform FilterParameters {\nuniform  float u_roughness;\nuniform  int u_sampleCount;\nuniform  int u_width;\nuniform  float u_lodBias;\nuniform  int u_distribution; // enum\nuniform int u_currentFace;\nuniform int u_isGeneratingLUT;\n\n//layout (location = 0) in vec2 inUV;\nin vec2 texCoord;\n\nout vec4 fragmentColor;\n\n//layout(location = 6) out vec3 outLUT;\n\nvec3 uvToXYZ(int face, vec2 uv)\n{\n    if(face == 0)\n        return vec3(     1.f,   uv.y,    -uv.x);\n\n    else if(face == 1)\n        return vec3(    -1.f,   uv.y,     uv.x);\n\n    else if(face == 2)\n        return vec3(   +uv.x,   -1.f,    +uv.y);\n\n    else if(face == 3)\n        return vec3(   +uv.x,    1.f,    -uv.y);\n\n    else if(face == 4)\n        return vec3(   +uv.x,   uv.y,      1.f);\n\n    else {//if(face == 5)\n        return vec3(    -uv.x,  +uv.y,     -1.f);}\n}\n\nvec2 dirToUV(vec3 dir)\n{\n    return vec2(\n            0.5f + 0.5f * atan(dir.z, dir.x) / MATH_PI,\n            1.f - acos(dir.y) / MATH_PI);\n}\n\nfloat saturate(float v)\n{\n    return clamp(v, 0.0f, 1.0f);\n}\n\n// Hammersley Points on the Hemisphere\n// CC BY 3.0 (Holger Dammertz)\n// http://holger.dammertz.org/stuff/notes_HammersleyOnHemisphere.html\n// with adapted interface\nfloat radicalInverse_VdC(uint bits)\n{\n    bits = (bits << 16u) | (bits >> 16u);\n    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\n    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\n    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\n    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\n    return float(bits) * 2.3283064365386963e-10; // / 0x100000000\n}\n\n// hammersley2d describes a sequence of points in the 2d unit square [0,1)^2\n// that can be used for quasi Monte Carlo integration\nvec2 hammersley2d(int i, int N) {\n    return vec2(float(i)/float(N), radicalInverse_VdC(uint(i)));\n}\n\n// Hemisphere Sample\n\n// TBN generates a tangent bitangent normal coordinate frame from the normal\n// (the normal must be normalized)\nmat3 generateTBN(vec3 normal)\n{\n    vec3 bitangent = vec3(0.0, 1.0, 0.0);\n\n    float NdotUp = dot(normal, vec3(0.0, 1.0, 0.0));\n    float epsilon = 0.0000001;\n    if (1.0 - abs(NdotUp) <= epsilon)\n    {\n        // Sampling +Y or -Y, so we need a more robust bitangent.\n        if (NdotUp > 0.0)\n        {\n            bitangent = vec3(0.0, 0.0, 1.0);\n        }\n        else\n        {\n            bitangent = vec3(0.0, 0.0, -1.0);\n        }\n    }\n\n    vec3 tangent = normalize(cross(bitangent, normal));\n    bitangent = cross(normal, tangent);\n\n    return mat3(tangent, bitangent, normal);\n}\n\nstruct MicrofacetDistributionSample\n{\n    float pdf;\n    float cosTheta;\n    float sinTheta;\n    float phi;\n};\n\nfloat D_GGX(float NdotH, float roughness) {\n    float a = NdotH * roughness;\n    float k = roughness / (1.0 - NdotH * NdotH + a * a);\n    return k * k * (1.0 / MATH_PI);\n}\n\n// GGX microfacet distribution\n// https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.html\n// This implementation is based on https://bruop.github.io/ibl/,\n//  https://www.tobias-franke.eu/log/2014/03/30/notes_on_importance_sampling.html\n// and https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch20.html\nMicrofacetDistributionSample GGX(vec2 xi, float roughness)\n{\n    MicrofacetDistributionSample ggx;\n\n    // evaluate sampling equations\n    float alpha = roughness * roughness;\n    ggx.cosTheta = saturate(sqrt((1.0 - xi.y) / (1.0 + (alpha * alpha - 1.0) * xi.y)));\n    ggx.sinTheta = sqrt(1.0 - ggx.cosTheta * ggx.cosTheta);\n    ggx.phi = 2.0 * MATH_PI * xi.x;\n\n    // evaluate GGX pdf (for half vector)\n    ggx.pdf = D_GGX(ggx.cosTheta, alpha);\n\n    // Apply the Jacobian to obtain a pdf that is parameterized by l\n    // see https://bruop.github.io/ibl/\n    // Typically you'd have the following:\n    // float pdf = D_GGX(NoH, roughness) * NoH / (4.0 * VoH);\n    // but since V = N => VoH == NoH\n    ggx.pdf /= 4.0;\n\n    return ggx;\n}\n\n// NDF\nfloat D_Ashikhmin(float NdotH, float roughness)\n{\n    float alpha = roughness * roughness;\n    // Ashikhmin 2007, \"Distribution-based BRDFs\"\n    float a2 = alpha * alpha;\n    float cos2h = NdotH * NdotH;\n    float sin2h = 1.0 - cos2h;\n    float sin4h = sin2h * sin2h;\n    float cot2 = -cos2h / (a2 * sin2h);\n    return 1.0 / (MATH_PI * (4.0 * a2 + 1.0) * sin4h) * (4.0 * exp(cot2) + sin4h);\n}\n\n// NDF\nfloat D_Charlie(float sheenRoughness, float NdotH)\n{\n    sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]\n    float invR = 1.0 / sheenRoughness;\n    float cos2h = NdotH * NdotH;\n    float sin2h = 1.0 - cos2h;\n    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * MATH_PI);\n}\n\nMicrofacetDistributionSample Charlie(vec2 xi, float roughness)\n{\n    MicrofacetDistributionSample charlie;\n\n    float alpha = roughness * roughness;\n    charlie.sinTheta = pow(xi.y, alpha / (2.0*alpha + 1.0));\n    charlie.cosTheta = sqrt(1.0 - charlie.sinTheta * charlie.sinTheta);\n    charlie.phi = 2.0 * MATH_PI * xi.x;\n\n    // evaluate Charlie pdf (for half vector)\n    charlie.pdf = D_Charlie(alpha, charlie.cosTheta);\n\n    // Apply the Jacobian to obtain a pdf that is parameterized by l\n    charlie.pdf /= 4.0;\n\n    return charlie;\n}\n\nMicrofacetDistributionSample Lambertian(vec2 xi, float roughness)\n{\n    MicrofacetDistributionSample lambertian;\n\n    // Cosine weighted hemisphere sampling\n    // http://www.pbr-book.org/3ed-2018/Monte_Carlo_Integration/2D_Sampling_with_Multidimensional_Transformations.html#Cosine-WeightedHemisphereSampling\n    lambertian.cosTheta = sqrt(1.0 - xi.y);\n    lambertian.sinTheta = sqrt(xi.y); // equivalent to `sqrt(1.0 - cosTheta*cosTheta)`;\n    lambertian.phi = 2.0 * MATH_PI * xi.x;\n\n    lambertian.pdf = lambertian.cosTheta / MATH_PI; // evaluation for solid angle, therefore drop the sinTheta\n\n    return lambertian;\n}\n\n// getImportanceSample returns an importance sample direction with pdf in the .w component\nvec4 getImportanceSample(int sampleIndex, vec3 N, float roughness)\n{\n    // generate a quasi monte carlo point in the unit square [0.1)^2\n    vec2 xi = hammersley2d(sampleIndex, u_sampleCount);\n\n    MicrofacetDistributionSample importanceSample;\n\n    // generate the points on the hemisphere with a fitting mapping for\n    // the distribution (e.g. lambertian uses a cosine importance)\n    if(u_distribution == cLambertian)\n    {\n        importanceSample = Lambertian(xi, roughness);\n    }\n    else if(u_distribution == cGGX)\n    {\n        // Trowbridge-Reitz / GGX microfacet model (Walter et al)\n        // https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.html\n        importanceSample = GGX(xi, roughness);\n    }\n    else if(u_distribution == cCharlie)\n    {\n        importanceSample = Charlie(xi, roughness);\n    }\n\n    // transform the hemisphere sample to the normal coordinate frame\n    // i.e. rotate the hemisphere to the normal direction\n    vec3 localSpaceDirection = normalize(vec3(\n        importanceSample.sinTheta * cos(importanceSample.phi), \n        importanceSample.sinTheta * sin(importanceSample.phi), \n        importanceSample.cosTheta\n    ));\n    mat3 TBN = generateTBN(N);\n    vec3 direction = TBN * localSpaceDirection;\n\n    return vec4(direction, importanceSample.pdf);\n}\n\n// Mipmap Filtered Samples (GPU Gems 3, 20.4)\n// https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-20-gpu-based-importance-sampling\n// https://cgg.mff.cuni.cz/~jaroslav/papers/2007-sketch-fis/Final_sap_0073.pdf\nfloat computeLod(float pdf)\n{\n    // // Solid angle of current sample -- bigger for less likely samples\n    // float omegaS = 1.0 / (float(u_sampleCount) * pdf);\n    // // Solid angle of texel\n    // // note: the factor of 4.0 * MATH_PI \n    // float omegaP = 4.0 * MATH_PI / (6.0 * float(u_width) * float(u_width));\n    // // Mip level is determined by the ratio of our sample's solid angle to a texel's solid angle \n    // // note that 0.5 * log2 is equivalent to log4\n    // float lod = 0.5 * log2(omegaS / omegaP);\n\n    // babylon introduces a factor of K (=4) to the solid angle ratio\n    // this helps to avoid undersampling the environment map\n    // this does not appear in the original formulation by Jaroslav Krivanek and Mark Colbert\n    // log4(4) == 1\n    // lod += 1.0;\n\n    // We achieved good results by using the original formulation from Krivanek & Colbert adapted to cubemaps\n\n    // https://cgg.mff.cuni.cz/~jaroslav/papers/2007-sketch-fis/Final_sap_0073.pdf\n    float lod = 0.5 * log2( 6.0 * float(u_width) * float(u_width) / (float(u_sampleCount) * pdf));\n\n    return lod;\n}\n\nvec3 filterColor(vec3 N)\n{\n    //return  textureLod(uCubeMap, N, 3.0).rgb;\n    vec3 color = vec3(0.f);\n    float weight = 0.0f;\n\n    for(int i = 0; i < u_sampleCount; ++i)\n    {\n        vec4 importanceSample = getImportanceSample(i, N, u_roughness);\n\n        vec3 H = vec3(importanceSample.xyz);\n        float pdf = importanceSample.w;\n\n        // mipmap filtered samples (GPU Gems 3, 20.4)\n        float lod = computeLod(pdf);\n\n        // apply the bias to the lod\n        lod += u_lodBias;\n\n        if(u_distribution == cLambertian)\n        {\n            // sample lambertian at a lower resolution to avoid fireflies\n            vec3 lambertian = textureLod(uCubeMap, H, lod).rgb;\n\n            //// the below operations cancel each other out\n            // lambertian *= NdotH; // lamberts law\n            // lambertian /= pdf; // invert bias from importance sampling\n            // lambertian /= MATH_PI; // convert irradiance to radiance https://seblagarde.wordpress.com/2012/01/08/pi-or-not-to-pi-in-game-lighting-equation/\n\n            color += lambertian;\n        }\n        else if(u_distribution == cGGX || u_distribution == cCharlie)\n        {\n            // Note: reflect takes incident vector.\n            vec3 V = N;\n            vec3 L = normalize(reflect(-V, H));\n            float NdotL = dot(N, L);\n\n            if (NdotL > 0.0)\n            {\n                if(u_roughness == 0.0)\n                {\n                    // without this the roughness=0 lod is too high\n                    lod = u_lodBias;\n                }\n                vec3 sampleColor = textureLod(uCubeMap, L, lod).rgb;\n                color += sampleColor * NdotL;\n                weight += NdotL;\n            }\n        }\n    }\n\n    if(weight != 0.0f)\n    {\n        color /= weight;\n    }\n    else\n    {\n        color /= float(u_sampleCount);\n    }\n\n    return color.rgb ;\n}\n\n// From the filament docs. Geometric Shadowing function\n// https://google.github.io/filament/Filament.html#toc4.4.2\nfloat V_SmithGGXCorrelated(float NoV, float NoL, float roughness) {\n    float a2 = pow(roughness, 4.0);\n    float GGXV = NoL * sqrt(NoV * NoV * (1.0 - a2) + a2);\n    float GGXL = NoV * sqrt(NoL * NoL * (1.0 - a2) + a2);\n    return 0.5 / (GGXV + GGXL);\n}\n\n// https://github.com/google/filament/blob/master/shaders/src/brdf.fs#L136\nfloat V_Ashikhmin(float NdotL, float NdotV)\n{\n    return clamp(1.0 / (4.0 * (NdotL + NdotV - NdotL * NdotV)), 0.0, 1.0);\n}\n\n// Compute LUT for GGX distribution.\n// See https://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf\nvec3 LUT(float NdotV, float roughness)\n{\n    // Compute spherical view vector: (sin(phi), 0, cos(phi))\n    vec3 V = vec3(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);\n\n    // The macro surface normal just points up.\n    vec3 N = vec3(0.0, 0.0, 1.0);\n\n    // To make the LUT independant from the material's F0, which is part of the Fresnel term\n    // when substituted by Schlick's approximation, we factor it out of the integral,\n    // yielding to the form: F0 * I1 + I2\n    // I1 and I2 are slighlty different in the Fresnel term, but both only depend on\n    // NoL and roughness, so they are both numerically integrated and written into two channels.\n    float A = 0.0;\n    float B = 0.0;\n    float C = 0.0;\n\n    for(int i = 0; i < u_sampleCount; ++i)\n    {\n        // Importance sampling, depending on the distribution.\n        vec4 importanceSample = getImportanceSample(i, N, roughness);\n        vec3 H = importanceSample.xyz;\n        // float pdf = importanceSample.w;\n        vec3 L = normalize(reflect(-V, H));\n\n        float NdotL = saturate(L.z);\n        float NdotH = saturate(H.z);\n        float VdotH = saturate(dot(V, H));\n        if (NdotL > 0.0)\n        {\n            if (u_distribution == cGGX)\n            {\n                // LUT for GGX distribution.\n\n                // Taken from: https://bruop.github.io/ibl\n                // Shadertoy: https://www.shadertoy.com/view/3lXXDB\n                // Terms besides V are from the GGX PDF we're dividing by.\n                float V_pdf = V_SmithGGXCorrelated(NdotV, NdotL, roughness) * VdotH * NdotL / NdotH;\n                float Fc = pow(1.0 - VdotH, 5.0);\n                A += (1.0 - Fc) * V_pdf;\n                B += Fc * V_pdf;\n                C += 0.0;\n            }\n\n            if (u_distribution == cCharlie)\n            {\n                // LUT for Charlie distribution.\n                float sheenDistribution = D_Charlie(roughness, NdotH);\n                float sheenVisibility = V_Ashikhmin(NdotL, NdotV);\n\n                A += 0.0;\n                B += 0.0;\n                C += sheenVisibility * sheenDistribution * NdotL * VdotH;\n            }\n        }\n    }\n\n    // The PDF is simply pdf(v, h) -> NDF * <nh>.\n    // To parametrize the PDF over l, use the Jacobian transform, yielding to: pdf(v, l) -> NDF * <nh> / 4<vh>\n    // Since the BRDF divide through the PDF to be normalized, the 4 can be pulled out of the integral.\n    return vec3(4.0 * A, 4.0 * B, 4.0 * 2.0 * MATH_PI * C) / float(u_sampleCount);\n}\n\n// entry point\nvoid main()\n{\n    vec3 color = vec3(0);\n\n    if(u_isGeneratingLUT == 0)\n    {\n        vec2 newUV = texCoord ;\n\n        newUV = newUV*2.0-1.0;\n\n        vec3 scan = uvToXYZ(u_currentFace, newUV);\n\n        vec3 direction = normalize(scan);\n        direction.y = -direction.y;\n    \n        color = filterColor(direction);\n    }\n    else\n    {\n        color = LUT(texCoord.x, texCoord.y);\n    }\n    \n    fragmentColor = vec4(color,1.0);\n}\n\n"; // eslint-disable-line

  var panoramaToCubeMap = "#define MATH_PI 3.1415926535897932384626433832795\n#define MATH_INV_PI (1.0 / MATH_PI)\n\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 texCoord;\nout vec4 fragmentColor;\n\nuniform int u_currentFace;\n\nuniform sampler2D u_inputTexture;\nuniform sampler2D u_panorama;\n\nvec3 uvToXYZ(int face, vec2 uv)\n{\n\tif(face == 0)\n\t\treturn vec3(     1.f,   uv.y,    -uv.x);\n\n\telse if(face == 1)\n\t\treturn vec3(    -1.f,   uv.y,     uv.x);\n\n\telse if(face == 2)\n\t\treturn vec3(   +uv.x,   -1.f,    +uv.y);\n\n\telse if(face == 3)\n\t\treturn vec3(   +uv.x,    1.f,    -uv.y);\n\n\telse if(face == 4)\n\t\treturn vec3(   +uv.x,   uv.y,      1.f);\n\n\telse //if(face == 5)\n\t{\treturn vec3(    -uv.x,  +uv.y,     -1.f);}\n}\n\nvec2 dirToUV(vec3 dir)\n{\n\treturn vec2(\n\t\t0.5f + 0.5f * atan(dir.z, dir.x) / MATH_PI,\n\t\t1.f - acos(dir.y) / MATH_PI);\n}\n\nvec3 panoramaToCubeMap(int face, vec2 texCoord)\n{\n\tvec2 texCoordNew = texCoord*2.0-1.0;\n\tvec3 scan = uvToXYZ(face, texCoordNew);\n\tvec3 direction = normalize(scan);\n\tvec2 src = dirToUV(direction);\n\n\treturn  texture(u_panorama, src).rgb;\n}\n\nvoid main(void)\n{\n    fragmentColor = vec4(0.0, 0.0, 0.0, 1.0);\n\n\tfragmentColor.rgb = panoramaToCubeMap(u_currentFace, texCoord);\n}\n"; // eslint-disable-line

  var debugOutput = "\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 texCoord;\nout vec4 fragmentColor;\n\nuniform int u_currentFace;\n\nuniform samplerCube u_inputTexture;\n\nvec3 uvToXYZ(int face, vec2 uv)\n{\n\tif(face == 0)\n\t\treturn vec3(     1.f,   uv.y,    -uv.x);\n\t\t\n\telse if(face == 1)\n\t\treturn vec3(    -1.f,   uv.y,     uv.x);\n\t\t\n\telse if(face == 2)\n\t\treturn vec3(   +uv.x,   -1.f,    +uv.y);\t\t\n\t\n\telse if(face == 3)\n\t\treturn vec3(   +uv.x,    1.f,    -uv.y);\n\t\t\n\telse if(face == 4)\n\t\treturn vec3(   +uv.x,   uv.y,      1.f);\n\t\t\n\telse //if(face == 5)\n\t{\treturn vec3(    -uv.x,  +uv.y,     -1.f);}\n}\n\nvoid main(void)   \n{\n\n    fragmentColor = vec4(texCoord.x*10.0, 0.0, texCoord.y*10.0, 1.0);\n\t\n\n\tvec2 newUV =texCoord;\n\tnewUV = newUV*2.0-1.0;\n\n\tvec4 textureColor = vec4(0.0, 0.0, 0.0, 1.0);\n\n\tvec3 direction = normalize(uvToXYZ(u_currentFace, newUV.xy));\n \n    textureColor = textureLod(u_inputTexture, direction,1.0);\n\t//textureColor = texture(u_inputTexture, texCoord);\n\t\n\tif(texCoord.x>0.1)\n\t{\n\t\tfragmentColor = textureColor;\n\t}\n\n\tif(texCoord.y>0.1)\n\t{\n\t\tfragmentColor = textureColor;\n\t}\n\n}"; // eslint-disable-line

  var fullscreenShader = "precision highp float;\n#define GLSLIFY 1\n\nout vec2 texCoord;\n\nvoid main(void) \n{\n    float x = float((gl_VertexID & 1) << 2);\n    float y = float((gl_VertexID & 2) << 1);\n    texCoord.x = x * 0.5;\n    texCoord.y = y * 0.5;\n    gl_Position = vec4(x - 1.0, y - 1.0, 0, 1);\n}"; // eslint-disable-line

  // How to use:
  // set canvas/context in constructor
  // init(input: panorama image)
  // filterAll()
  // fetch texture IDs

  class iblSampler
  {
      constructor(view)
      {

          this.gl = view.context;

          this.textureSize = 256;
          this.ggxSampleCount = 1024;
          this.lambertianSampleCount = 2048;
          this.sheenSamplCount = 64;
          this.lodBias = 0.0;
          this.lowestMipLevel = 4;
          this.lutResolution = 1024;

          this.mipmapCount = undefined;

          this.lambertianTextureID = undefined;
          this.ggxTextureID = undefined;
          this.sheenTextureID = undefined;

          this.ggxLutTextureID = undefined;
          this.charlieLutTextureID = undefined;

          this.inputTextureID = undefined;
          this.cubemapTextureID = undefined;
          this.framebuffer = undefined;

          const shaderSources = new Map();

          shaderSources.set("fullscreen.vert", fullscreenShader);
          shaderSources.set("panorama_to_cubemap.frag", panoramaToCubeMap);
          shaderSources.set("ibl_filtering.frag", iblFiltering);
          shaderSources.set("debug.frag", debugOutput);

          this.shaderCache = new ShaderCache(shaderSources, view.renderer.webGl);


      }

      /////////////////////////////////////////////////////////////////////


      loadTextureHDR(image)
      {

          var texture = this.gl.createTexture();

          this.gl.bindTexture( this.gl.TEXTURE_2D,  texture);

          var internalFormat = this.gl.RGB32F;
          var format = this.gl.RGB;
          var type = this.gl.FLOAT;
          var data = undefined;

          if (image.dataFloat instanceof Float32Array && typeof(this.gl.RGB32F) !== 'undefined')
          {
              internalFormat = this.gl.RGB32F;
              format = this.gl.RGB;
              type = this.gl.FLOAT;
              data = image.dataFloat;
          }
          else if(image.dataFloat instanceof Float32Array)
          {
              // workaround for node-gles not supporting RGB32F
              internalFormat = this.gl.RGBA32F;
              format = this.gl.RGBA;
              type = this.gl.FLOAT;

              const numPixels = image.dataFloat.length / 3;
              data = new Float32Array(numPixels * 4);
              for(let i = 0; i < numPixels; ++i)
              {
                  // copy the pixels and padd the alpha channel
                  data[i] = image.dataFloat[i];
                  data[i+1] = image.dataFloat[i+1];
                  data[i+2] = image.dataFloat[i+2];
                  data[i+3] = 0;
              }
          }
          else if (typeof(Image) !== 'undefined' && image instanceof Image)
          {
              internalFormat = this.gl.RGBA;
              format = this.gl.RGBA;
              type = this.gl.UNSIGNED_BYTE;
              data = image;
          }
          else
          {
              console.error("loadTextureHDR failed, unsupported HDR image");
              return;
          }


          this.gl.texImage2D(
              this.gl.TEXTURE_2D,
              0, //level
              internalFormat,
              image.width,
              image.height,
              0, //border
              format,
              type,
              data);

          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_WRAP_S,  this.gl.MIRRORED_REPEAT);
          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_WRAP_T,  this.gl.MIRRORED_REPEAT);
          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_MIN_FILTER,  this.gl.LINEAR);
          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_MAG_FILTER,  this.gl.LINEAR);

          return texture;
      }



      createCubemapTexture(withMipmaps)
      {
          var targetTexture =  this.gl.createTexture();
          this.gl.bindTexture( this.gl.TEXTURE_CUBE_MAP, targetTexture);


          // define size and format of level 0
          const level = 0;
          const internalFormat = this.use8bit ? this.gl.RGBA8 : this.gl.RGBA32F;
          const border = 0;
          const format = this.gl.RGBA;
          const type = this.use8bit ? this.gl.UNSIGNED_BYTE : this.gl.FLOAT;
          const data = null;

          for(var i = 0; i < 6; ++i)
          {
              this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, level, internalFormat,
                  this.textureSize, this.textureSize, border,
                  format, type, data);

          }

          if(withMipmaps)
          {
              this.gl.texParameteri( this.gl.TEXTURE_CUBE_MAP,  this.gl.TEXTURE_MIN_FILTER,  this.gl.LINEAR_MIPMAP_LINEAR);
          }
          else
          {
              this.gl.texParameteri( this.gl.TEXTURE_CUBE_MAP,  this.gl.TEXTURE_MIN_FILTER,  this.gl.LINEAR);
          }

          this.gl.texParameteri( this.gl.TEXTURE_CUBE_MAP,  this.gl.TEXTURE_MAG_FILTER,  this.gl.LINEAR);
          this.gl.texParameteri( this.gl.TEXTURE_CUBE_MAP,  this.gl.TEXTURE_WRAP_S,  this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri( this.gl.TEXTURE_CUBE_MAP,  this.gl.TEXTURE_WRAP_T,  this.gl.CLAMP_TO_EDGE);

          return targetTexture;
      }

      createLutTexture()
      {
          const targetTexture = this.gl.createTexture();
          this.gl.bindTexture(this.gl.TEXTURE_2D, targetTexture);

          // define size and format of level 0
          const level = 0;
          const internalFormat = this.use8bit ? this.gl.RGBA8 : this.gl.RGBA32F;
          const border = 0;
          const format = this.gl.RGBA;
          const type = this.use8bit ? this.gl.UNSIGNED_BYTE : this.gl.FLOAT;
          const data = null;

          this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
              this.lutResolution, this.lutResolution, border,
              format, type, data);

          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_MIN_FILTER,  this.gl.LINEAR);
          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_MAG_FILTER,  this.gl.LINEAR);
          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_WRAP_S,  this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri( this.gl.TEXTURE_2D,  this.gl.TEXTURE_WRAP_T,  this.gl.CLAMP_TO_EDGE);

          return targetTexture;
      }

      init(panoramaImage)
      {
          if (!this.gl.getExtension('EXT_color_buffer_float'))
          {
              this.use8bit = true;
          }

          this.inputTextureID = this.loadTextureHDR(panoramaImage);

          this.cubemapTextureID = this.createCubemapTexture(true);

          this.framebuffer = this.gl.createFramebuffer();

          this.lambertianTextureID = this.createCubemapTexture(false);
          this.ggxTextureID = this.createCubemapTexture(true);
          this.sheenTextureID = this.createCubemapTexture(true);


          this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.ggxTextureID);
          this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);

          this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.sheenTextureID);
          this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);

          this.mipmapLevels = Math.floor(Math.log2(this.textureSize))+1 - this.lowestMipLevel;
      }

      filterAll()
      {
          this.panoramaToCubeMap();
          this.cubeMapToLambertian();
          this.cubeMapToGGX();
          this.cubeMapToSheen();

          this.sampleGGXLut();
          this.sampleCharlieLut();

          this.gl.bindFramebuffer(  this.gl.FRAMEBUFFER, null);
      }

      panoramaToCubeMap()
      {
          for(var i = 0; i < 6; ++i)
          {
              this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
              var side = i;
              this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+side, this.cubemapTextureID, 0);

              this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.cubemapTextureID);

              this.gl.viewport(0, 0,  this.textureSize,  this.textureSize);

              this.gl.clearColor(1.0, 0.0, 0.0, 0.0);
              this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT);

              const vertexHash = this.shaderCache.selectShader("fullscreen.vert", []);
              const fragmentHash = this.shaderCache.selectShader("panorama_to_cubemap.frag", []);

              var shader = this.shaderCache.getShaderProgram(fragmentHash, vertexHash);
              this.gl.useProgram(shader.program);

              //  TEXTURE0 = active.
              this.gl.activeTexture(this.gl.TEXTURE0+0);

              // Bind texture ID to active texture
              this.gl.bindTexture(this.gl.TEXTURE_2D, this.inputTextureID);

              // map shader uniform to texture unit (TEXTURE0)
              const location = this.gl.getUniformLocation(shader.program,"u_panorama");
              this.gl.uniform1i(location, 0); // texture unit 0 (TEXTURE0)

              shader.updateUniform("u_currentFace", i);

              //fullscreen triangle
              this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
          }

          this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.cubemapTextureID);
          this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);

      }


      applyFilter(
          distribution,
          roughness,
          targetMipLevel,
          targetTexture,
          sampleCount,
          lodBias = 0.0)
      {
          var currentTextureSize =  this.textureSize>>(targetMipLevel);

          for(var i = 0; i < 6; ++i)
          {

              this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
              var side = i;
              this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+side, targetTexture, targetMipLevel);

              this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, targetTexture);

              this.gl.viewport(0, 0, currentTextureSize, currentTextureSize);

              this.gl.clearColor(1.0, 0.0, 0.0, 0.0);
              this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT);


              const vertexHash = this.shaderCache.selectShader("fullscreen.vert", []);
              const fragmentHash = this.shaderCache.selectShader("ibl_filtering.frag", []);

              var shader = this.shaderCache.getShaderProgram(fragmentHash, vertexHash);
              this.gl.useProgram(shader.program);


              //  TEXTURE0 = active.
              this.gl.activeTexture(this.gl.TEXTURE0+0);

              // Bind texture ID to active texture
              this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.cubemapTextureID);

              // map shader uniform to texture unit (TEXTURE0)
              const location = this.gl.getUniformLocation(shader.program,"u_cubemapTexture");
              this.gl.uniform1i(location, 0); // texture unit 0


              shader.updateUniform("u_roughness", roughness);
              shader.updateUniform("u_sampleCount", sampleCount);
              shader.updateUniform("u_width", this.textureSize);
              shader.updateUniform("u_lodBias", lodBias);
              shader.updateUniform("u_distribution", distribution);
              shader.updateUniform("u_currentFace", i);
              shader.updateUniform("u_isGeneratingLUT", 0);


              //fullscreen triangle
              this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

          }

      }

      cubeMapToLambertian()
      {
          this.applyFilter(
              0,
              0.0,
              0,
              this.lambertianTextureID,
              this.lambertianSampleCount);
      }


      cubeMapToGGX()
      {
          for(var currentMipLevel = 0; currentMipLevel <= this.mipmapLevels; ++currentMipLevel)
          {
              const roughness =  (currentMipLevel) /  (this.mipmapLevels - 1);
              this.applyFilter(
                  1,
                  roughness,
                  currentMipLevel,
                  this.ggxTextureID,
                  this.ggxSampleCount);
          }
      }

      cubeMapToSheen()
      {
          for(var currentMipLevel = 0; currentMipLevel <= this.mipmapLevels; ++currentMipLevel)
          {
              const roughness =  (currentMipLevel) /  (this.mipmapLevels - 1);
              this.applyFilter(
                  2,
                  roughness,
                  currentMipLevel,
                  this.sheenTextureID,
                  this.sheenSamplCount);
          }
      }

      sampleLut(distribution, targetTexture, currentTextureSize)
      {
          this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
          this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, targetTexture, 0);

          this.gl.bindTexture(this.gl.TEXTURE_2D, targetTexture);

          this.gl.viewport(0, 0, currentTextureSize, currentTextureSize);

          this.gl.clearColor(1.0, 0.0, 0.0, 0.0);
          this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT);


          const vertexHash = this.shaderCache.selectShader("fullscreen.vert", []);
          const fragmentHash = this.shaderCache.selectShader("ibl_filtering.frag", []);

          var shader = this.shaderCache.getShaderProgram(fragmentHash, vertexHash);
          this.gl.useProgram(shader.program);


          //  TEXTURE0 = active.
          this.gl.activeTexture(this.gl.TEXTURE0+0);

          // Bind texture ID to active texture
          this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.cubemapTextureID);

          // map shader uniform to texture unit (TEXTURE0)
          const location = this.gl.getUniformLocation(shader.program,"u_cubemapTexture");
          this.gl.uniform1i(location, 0); // texture unit 0


          shader.updateUniform("u_roughness", 0.0);
          shader.updateUniform("u_sampleCount", 512);
          shader.updateUniform("u_width", 0.0);
          shader.updateUniform("u_lodBias", 0.0);
          shader.updateUniform("u_distribution", distribution);
          shader.updateUniform("u_currentFace", 0);
          shader.updateUniform("u_isGeneratingLUT", 1);

          //fullscreen triangle
          this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
      }

      sampleGGXLut()
      {
          this.ggxLutTextureID = this.createLutTexture();
          this.sampleLut(1, this.ggxLutTextureID, this.lutResolution);
      }

      sampleCharlieLut()
      {
          this.charlieLutTextureID = this.createLutTexture();
          this.sampleLut(2, this.charlieLutTextureID, this.lutResolution);
      }

      destroy()
      {
          this.shaderCache.destroy();
      }
  }

  class KtxDecoder {

      constructor (context, externalKtxlib) {
          this.gl = context;
          this.libktx = null;
          if (context !== undefined)
          {
              if (externalKtxlib === undefined && LIBKTX !== undefined)
              {
                  externalKtxlib = LIBKTX;
              }
              if (externalKtxlib !== undefined)
              {
                  this.initializied = this.init(context, externalKtxlib);
              }
              else
              {
                  console.error('Failed to initalize KTXDecoder: ktx library undefined');
                  return undefined;
              }
          }
          else
          {
              console.error('Failed to initalize KTXDecoder: WebGL context undefined');
              return undefined;
          }
      }

      async init(context, externalKtxlib) {
          this.libktx = await externalKtxlib({preinitializedWebGLContext: context});
          this.libktx.GL.makeContextCurrent(this.libktx.GL.createContext(null, { majorVersion: 2.0 }));
      }

      transcode(ktexture) {
          if (ktexture.needsTranscoding) {
              let format;

              let astcSupported = false;
              let etcSupported = false;
              let dxtSupported = false;
              let bptcSupported = false;
              let pvrtcSupported = false;

              astcSupported = !!this.gl.getExtension('WEBGL_compressed_texture_astc');
              etcSupported = !!this.gl.getExtension('WEBGL_compressed_texture_etc1');
              dxtSupported = !!this.gl.getExtension('WEBGL_compressed_texture_s3tc');
              bptcSupported = !!this.gl.getExtension('EXT_texture_compression_bptc');

              pvrtcSupported = !!(this.gl.getExtension('WEBGL_compressed_texture_pvrtc')) || !!(this.gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'));

              if (astcSupported) {
                  format = this.libktx.TranscodeTarget.ASTC_4x4_RGBA;
              } else if (bptcSupported) {
                  //https://github.com/KhronosGroup/KTX-Software/issues/369
                  //BC7_M5_RGBA will be mapped to KTX_TTF_BC7_RGBA in the c++ code
                  format = this.libktx.TranscodeTarget.BC7_M5_RGBA;
              } else if (dxtSupported) {
                  format = this.libktx.TranscodeTarget.BC1_OR_3;
              } else if (pvrtcSupported) {
                  format = this.libktx.TranscodeTarget.PVRTC1_4_RGBA;
              } else if (etcSupported) {
                  format = this.libktx.TranscodeTarget.ETC;
              } else {
                  format = this.libktx.TranscodeTarget.RGBA8888;
              }
              if (ktexture.transcodeBasis(format, 0) != this.libktx.ErrorCode.SUCCESS) {
                  console.warn('Texture transcode failed. See console for details.');
              }
          }
      }

      async loadKtxFromUri(uri) {
          await this.initializied;
          const response = await fetch(uri);
          const data = new Uint8Array(await response.arrayBuffer());
          const texture = new this.libktx.ktxTexture(data);
          this.transcode(texture);
          let uploadResult = texture.glUpload();
          uploadResult.texture.levels = Math.log2(texture.baseWidth);
          return uploadResult.texture;
      }

      async loadKtxFromBuffer(data) {
          await this.initializied;
          const texture = new this.libktx.ktxTexture(data);
          this.transcode(texture);
          const uploadResult = texture.glUpload();
          return uploadResult.texture;
      }
  }

  /**
   * hdrpng.js - Original code from Enki https://enkimute.github.io/hdrpng.js/
   *
   * Refactored and simplified.
   */

  function _rgbeToFloat(buffer)
  {
      const length = buffer.byteLength >> 2;
      const result = new Float32Array(length * 3);

      for (let i = 0; i < length; i++)
      {
          const s = Math.pow(2, buffer[i * 4 + 3] - (128 + 8));

          result[i * 3] = buffer[i * 4] * s;
          result[i * 3 + 1] = buffer[i * 4 + 1] * s;
          result[i * 3 + 2] = buffer[i * 4 + 2] * s;
      }
      return result;
  }

  async function loadHDR(buffer)
  {
      let header = '';
      let pos = 0;
      const d8 = buffer;
      let format = undefined;
      // read header.
      while (!header.match(/\n\n[^\n]+\n/g)) header += String.fromCharCode(d8[pos++]);
      // check format.
      format = header.match(/FORMAT=(.*)$/m);
      if (format.length < 2)
      {
          return undefined;
      }
      format = format[1];
      if (format != '32-bit_rle_rgbe') return console.warn('unknown format : ' + format), this.onerror();
      // parse resolution
      let rez = header.split(/\n/).reverse();
      if (rez.length < 2)
      {
          return undefined;
      }
      rez = rez[1].split(' ');
      if (rez.length < 4)
      {
          return undefined;
      }
      const width = rez[3] * 1, height = rez[1] * 1;
      // Create image.
      const img = new Uint8Array(width * height * 4);
      let ipos = 0;
      // Read all scanlines
      for (let j = 0; j < height; j++)
      {
          const scanline = [];

          let rgbe = d8.slice(pos, pos += 4);
          const isNewRLE = (rgbe[0] == 2 && rgbe[1] == 2 && rgbe[2] == ((width >> 8) & 0xFF) && rgbe[3] == (width & 0xFF));

          if (isNewRLE && (width >= 8) && (width < 32768))
          {
              for (let i = 0; i < 4; i++)
              {
                  let ptr = i * width;
                  const ptr_end = (i + 1) * width;
                  let buf = undefined;
                  let count = undefined;
                  while (ptr < ptr_end)
                  {
                      buf = d8.slice(pos, pos += 2);
                      if (buf[0] > 128)
                      {
                          count = buf[0] - 128;
                          while (count-- > 0) scanline[ptr++] = buf[1];
                      }
                      else
                      {
                          count = buf[0] - 1;
                          scanline[ptr++] = buf[1];
                          while (count-- > 0) scanline[ptr++] = d8[pos++];
                      }
                  }
              }

              for (let i = 0; i < width; i++)
              {
                  img[ipos++] = scanline[i + 0 * width];
                  img[ipos++] = scanline[i + 1 * width];
                  img[ipos++] = scanline[i + 2 * width];
                  img[ipos++] = scanline[i + 3 * width];
              }
          }
          else
          {
              pos -= 4;

              for (let i = 0; i < width; i++)
              {
                  rgbe = d8.slice(pos, pos += 4);

                  img[ipos++] = rgbe[0];
                  img[ipos++] = rgbe[1];
                  img[ipos++] = rgbe[2];
                  img[ipos++] = rgbe[3];
              }
          }
      }

      const imageFloatBuffer = _rgbeToFloat(img);

      return {
          dataFloat: imageFloatBuffer,
          width: width,
          height: height
      };
  }

  /**
   * ResourceLoader can be used to load resources for the GltfState
   * that are then used to display the loaded data with GltfView
   */
  class ResourceLoader
  {
      /**
       * ResourceLoader class that provides an interface to load resources into
       * the view. Typically this is created with GltfView.createResourceLoader()
       * You cannot share resource loaders between GltfViews as some of the resources
       * are allocated directly on the WebGl2 Context
       * @param {Object} view the GltfView for which the resources are loaded
       */
      constructor(view)
      {
          this.view = view;
      }

      /**
       * loadGltf asynchroneously and create resources for rendering
       * @param {(String | ArrayBuffer | File)} gltfFile the .gltf or .glb file either as path or as preloaded resource. In node.js environments, only ArrayBuffer types are accepted.
       * @param {File[]} [externalFiles] additional files containing resources that are referenced in the gltf
       * @returns {Promise} a promise that fulfills when the gltf file was loaded
       */
      async loadGltf(gltfFile, externalFiles)
      {
          let isGlb = undefined;
          let buffers = undefined;
          let json = undefined;
          let data = undefined;
          let filename = "";
          if (typeof gltfFile === "string")
          {
              isGlb = getIsGlb(gltfFile);
              let response = await axios$1.get(gltfFile, { responseType: isGlb ? "arraybuffer" : "json" });
              json = response.data;
              data = response.data;
              filename = gltfFile;
          }
          else if (gltfFile instanceof ArrayBuffer)
          {
              isGlb = externalFiles === undefined;
              if (isGlb)
              {
                  data = gltfFile;
              }
              else
              {
                  console.error("Only .glb files can be loaded from an array buffer");
              }
          }
          else if (typeof (File) !== 'undefined' && gltfFile instanceof File)
          {
              let fileContent = gltfFile;
              filename = gltfFile.name;
              isGlb = getIsGlb(filename);
              if (isGlb)
              {
                  data = await AsyncFileReader.readAsArrayBuffer(fileContent);
              }
              else
              {
                  data = await AsyncFileReader.readAsText(fileContent);
                  json = JSON.parse(data);
                  buffers = externalFiles;
              }
          }
          else
          {
              console.error("Passed invalid type to loadGltf " + typeof (gltfFile));
          }

          if (isGlb)
          {
              const glbParser = new GlbParser(data);
              const glb = glbParser.extractGlbData();
              json = glb.json;
              buffers = glb.buffers;
          }

          const gltf = new glTF(filename);
          gltf.ktxDecoder = this.view.ktxDecoder;
          //Make sure draco decoder instance is ready
          gltf.fromJson(json);

          // because the gltf image paths are not relative
          // to the gltf, we have to resolve all image paths before that
          for (const image of gltf.images)
          {
              image.resolveRelativePath(getContainingFolder(gltf.path));
          }

          await gltfLoader.load(gltf, this.view.context, buffers);

          return gltf;
      }

      /**
       * loadEnvironment asynchroneously, run IBL sampling and create resources for rendering
       * @param {(String | ArrayBuffer | File)} environmentFile the .hdr file either as path or resource
       * @param {Object} [lutFiles] object containing paths or resources for the environment look up textures. Keys are lut_ggx_file, lut_charlie_file and lut_sheen_E_file
       * @returns {Promise} a promise that fulfills when the environment file was loaded
       */
      async loadEnvironment(environmentFile, lutFiles)
      {
          let image = undefined;
          if (typeof environmentFile === "string")
          {
              let response = await axios$1.get(environmentFile, { responseType: "arraybuffer" });

              image = await loadHDR(new Uint8Array(response.data));
          }
          else if (environmentFile instanceof ArrayBuffer)
          {
              image = await loadHDR(new Uint8Array(environmentFile));
          }
          else if (typeof (File) !== 'undefined' && environmentFile instanceof File)
          {
              const imageData = await AsyncFileReader.readAsArrayBuffer(environmentFile).catch(() =>
              {
                  console.error("Could not load image with FileReader");
              });
              image = await loadHDR(new Uint8Array(imageData));
          }
          else
          {
              console.error("Passed invalid type to loadEnvironment " + typeof (gltfFile));
          }
          if (image === undefined)
          {
              return undefined;
          }
          return _loadEnvironmentFromPanorama(image, this.view, lutFiles);
      }

      /**
       * initKtxLib must be called before loading gltf files with ktx2 assets
       * @param {Object} [externalKtxLib] external ktx library (for example from a CDN)
       */
      initKtxLib(externalKtxLib)
      {
          this.view.ktxDecoder = new KtxDecoder(this.view.context, externalKtxLib);
      }

      /**
       * initDracoLib must be called before loading gltf files with draco meshes
       * @param {*} [externalDracoLib] external draco library (for example from a CDN)
       */
      async initDracoLib(externalDracoLib)
      {
          const dracoDecoder = new DracoDecoder(externalDracoLib);
          if (dracoDecoder !== undefined)
          {
              await dracoDecoder.ready();
          }
      }
  }

  async function _loadEnvironmentFromPanorama(imageHDR, view, luts)
  {
      // The environment uses the same type of samplers, textures and images as used in the glTF class
      // so we just use it as a template
      const environment = new glTF();

      //
      // Prepare samplers.
      //

      let samplerIdx = environment.samplers.length;

      environment.samplers.push(new gltfSampler(GL.LINEAR, GL.LINEAR, GL.CLAMP_TO_EDGE, GL.CLAMP_TO_EDGE, "DiffuseCubeMapSampler"));
      const diffuseCubeSamplerIdx = samplerIdx++;

      environment.samplers.push(new gltfSampler(GL.LINEAR, GL.LINEAR_MIPMAP_LINEAR, GL.CLAMP_TO_EDGE, GL.CLAMP_TO_EDGE, "SpecularCubeMapSampler"));
      const specularCubeSamplerIdx = samplerIdx++;

      environment.samplers.push(new gltfSampler(GL.LINEAR, GL.LINEAR_MIPMAP_LINEAR, GL.CLAMP_TO_EDGE, GL.CLAMP_TO_EDGE, "SheenCubeMapSampler"));
      const sheenCubeSamplerIdx = samplerIdx++;

      environment.samplers.push(new gltfSampler(GL.LINEAR, GL.LINEAR, GL.CLAMP_TO_EDGE, GL.CLAMP_TO_EDGE, "LUTSampler"));
      const lutSamplerIdx = samplerIdx++;

      //
      // Prepare images and textures.
      //

      let imageIdx = environment.images.length;

      let environmentFiltering = new iblSampler(view);

      environmentFiltering.init(imageHDR);
      environmentFiltering.filterAll();

      // Diffuse

      const diffuseGltfImage = new gltfImage(
          undefined,
          GL.TEXTURE_CUBE_MAP,
          0,
          undefined,
          "Diffuse",
          ImageMimeType.GLTEXTURE,
          environmentFiltering.lambertianTextureID
      );

      environment.images.push(diffuseGltfImage);

      const diffuseTexture = new gltfTexture(
          diffuseCubeSamplerIdx,
          [imageIdx++],
          GL.TEXTURE_CUBE_MAP);
      diffuseTexture.initialized = true; // iblsampler has already initialized the texture

      environment.textures.push(diffuseTexture);

      environment.diffuseEnvMap = new gltfTextureInfo(environment.textures.length - 1, 0, true);
      environment.diffuseEnvMap.generateMips = false;



      // Specular
      const specularGltfImage = new gltfImage(
          undefined,
          GL.TEXTURE_CUBE_MAP,
          0,
          undefined,
          "Specular",
          ImageMimeType.GLTEXTURE,
          environmentFiltering.ggxTextureID
      );

      environment.images.push(specularGltfImage);

      const specularTexture = new gltfTexture(
          specularCubeSamplerIdx,
          [imageIdx++],
          GL.TEXTURE_CUBE_MAP);
      specularTexture.initialized = true; // iblsampler has already initialized the texture

      environment.textures.push(specularTexture);

      environment.specularEnvMap = new gltfTextureInfo(environment.textures.length - 1, 0, true);
      environment.specularEnvMap.generateMips = false;


      // Sheen
      const sheenGltfImage = new gltfImage(
          undefined,
          GL.TEXTURE_CUBE_MAP,
          0,
          undefined,
          "Sheen",
          ImageMimeType.GLTEXTURE,
          environmentFiltering.sheenTextureID
      );

      environment.images.push(sheenGltfImage);

      const sheenTexture = new gltfTexture(
          sheenCubeSamplerIdx,
          [imageIdx++],
          GL.TEXTURE_CUBE_MAP);
      sheenTexture.initialized = true; // iblsampler has already initialized the texture

      environment.textures.push(sheenTexture);

      environment.sheenEnvMap = new gltfTextureInfo(environment.textures.length - 1, 0, true);
      environment.sheenEnvMap.generateMips = false;

      /*
          // Diffuse

          const lambertian = new gltfImage(filteredEnvironmentsDirectoryPath + "/lambertian/diffuse.ktx2", GL.TEXTURE_CUBE_MAP);
          lambertian.mimeType = ImageMimeType.KTX2;
          environment.images.push(lambertian);
          environment.textures.push(new gltfTexture(diffuseCubeSamplerIdx, [imageIdx++], GL.TEXTURE_CUBE_MAP));
          environment.diffuseEnvMap = new gltfTextureInfo(environment.textures.length - 1, 0, true);
          environment.diffuseEnvMap.generateMips = false;

          // Specular

          const specular = new gltfImage(filteredEnvironmentsDirectoryPath + "/ggx/specular.ktx2", GL.TEXTURE_CUBE_MAP);
          specular.mimeType = ImageMimeType.KTX2;
          environment.images.push(specular);
          environment.textures.push(new gltfTexture(specularCubeSamplerIdx, [imageIdx++], GL.TEXTURE_CUBE_MAP));
          environment.specularEnvMap = new gltfTextureInfo(environment.textures.length - 1, 0, true);
          environment.specularEnvMap.generateMips = false;

          const specularImage = environment.images[environment.textures[environment.textures.length - 1].source];

          // Sheen

          const sheen = new gltfImage(filteredEnvironmentsDirectoryPath + "/charlie/sheen.ktx2", GL.TEXTURE_CUBE_MAP);
          sheen.mimeType = ImageMimeType.KTX2;
          environment.images.push(sheen);
          environment.textures.push(new gltfTexture(sheenCubeSamplerIdx, [imageIdx++], GL.TEXTURE_CUBE_MAP));
          environment.sheenEnvMap = new gltfTextureInfo(environment.textures.length - 1, 0, true);
          environment.sheenEnvMap.generateMips = false;*/

      //
      // Look Up Tables.
      //

      // GGX

      if (luts === undefined)
      {
          luts = {
              lut_sheen_E_file: "assets/images/lut_sheen_E.png",
          };
      }

      environment.images.push(new gltfImage(
          undefined, 
          GL.TEXTURE_2D, 
          0, 
          undefined, 
          undefined, 
          ImageMimeType.GLTEXTURE, 
          environmentFiltering.ggxLutTextureID));
      const lutTexture = new gltfTexture(lutSamplerIdx, [imageIdx++], GL.TEXTURE_2D);
      lutTexture.initialized = true; // iblsampler has already initialized the texture
      environment.textures.push(lutTexture);

      environment.lut = new gltfTextureInfo(environment.textures.length - 1, 0 , true);
      environment.lut.generateMips = false;

      // Sheen
      // Charlie
      environment.images.push(new gltfImage(
          undefined, 
          GL.TEXTURE_2D, 
          0, 
          undefined, 
          undefined, 
          ImageMimeType.GLTEXTURE, 
          environmentFiltering.charlieLutTextureID));
      const charlieLut = new gltfTexture(lutSamplerIdx, [imageIdx++], GL.TEXTURE_2D);
      charlieLut.initialized = true; // iblsampler has already initialized the texture
      environment.textures.push(charlieLut);

      environment.sheenLUT = new gltfTextureInfo(environment.textures.length - 1, 0, true);
      environment.sheenLUT.generateMips = false;

      // Sheen E LUT

      environment.images.push(new gltfImage(luts.lut_sheen_E_file, GL.TEXTURE_2D, 0, undefined, undefined, ImageMimeType.PNG));
      const sheenELut = new gltfTexture(lutSamplerIdx, [imageIdx++], GL.TEXTURE_2D);
      sheenELut.initialized = true; // iblsampler has already initialized the texture
      environment.textures.push(sheenELut);

      environment.sheenELUT = new gltfTextureInfo(environment.textures.length - 1);
      environment.sheenELUT.generateMips = false;

      await gltfLoader.loadImages(environment);

      environment.initGl(view.context);

      environment.mipCount = environmentFiltering.mipmapLevels;

      return environment;
  }

  /**
   * GltfView represents a view on a gltf, e.g. in a canvas
   */
  class GltfView
  {
      /**
       * GltfView representing one WebGl 2.0 context or in other words one
       * 3D rendering of the Gltf.
       * You can create multiple views for example when multiple canvases should
       * be shown on the same webpage.
       * @param {*} context WebGl 2.0 context. Get it from a canvas with `canvas.getContext("webgl2")`
       */
      constructor(context)
      {
          this.context = context;
          this.renderer = new gltfRenderer(this.context);
      }

      /**
       * createState constructs a new GltfState for the GltfView. The resources
       * referenced in a gltf state can directly be stored as resources on the WebGL
       * context of GltfView, therefore GltfStates cannot not be shared between
       * GltfViews.
       * @returns {GltfState} GltfState
       */
      createState()
      {
          return new GltfState(this);
      }

      /**
       * createResourceLoader creates a resource loader with which glTFs and
       * environments can be loaded for the view
       * @param {Object} [externalDracoLib] optional object of an external Draco library, e.g. from a CDN
       * @param {Object} [externalKtxLib] optional object of an external KTX library, e.g. from a CDN
       * @returns {ResourceLoader} ResourceLoader
       */
      createResourceLoader(externalDracoLib = undefined, externalKtxLib = undefined)
      {
          let resourceLoader = new ResourceLoader(this);
          resourceLoader.initKtxLib(externalKtxLib);
          resourceLoader.initDracoLib(externalDracoLib);
          return resourceLoader;
      }

      /**
       * renderFrame to the context's default frame buffer
       * Call this function in the javascript animation update loop for continuous rendering to a canvas
       * @param {*} state GltfState that is be used for rendering
       * @param {*} width of the viewport
       * @param {*} height of the viewport
       */
      renderFrame(state, width, height)
      {
          this._animate(state);

          this.renderer.resize(width, height);

          this.renderer.clearFrame(state.renderingParameters.clearColor);

          if(state.gltf === undefined)
          {
              return;
          }

          const scene = state.gltf.scenes[state.sceneIndex];

          if(scene === undefined)
          {
              return;
          }

          scene.applyTransformHierarchy(state.gltf);

          this.renderer.drawScene(state, scene);
      }

      /**
       * gatherStatistics collects information about the GltfState such as the number of
       * rendered meshes or triangles
       * @param {*} state GltfState about which the statistics should be collected
       * @returns {Object} an object containing statistics information
       */
      gatherStatistics(state)
      {
          if(state.gltf === undefined)
          {
              return;
          }

          // gather information from the active scene
          const scene = state.gltf.scenes[state.sceneIndex];
          if (scene === undefined)
          {
              return {
                  meshCount: 0,
                  faceCount: 0,
                  opaqueMaterialsCount: 0,
                  transparentMaterialsCount: 0};
          }
          const nodes = scene.gatherNodes(state.gltf);
          const activeMeshes = nodes.filter(node => node.mesh !== undefined).map(node => state.gltf.meshes[node.mesh]);
          const activePrimitives = activeMeshes
              .reduce((acc, mesh) => acc.concat(mesh.primitives), [])
              .filter(primitive => primitive.material !== undefined);
          const activeMaterials = [... new Set(activePrimitives.map(primitive => state.gltf.materials[primitive.material]))];
          const opaqueMaterials = activeMaterials.filter(material => material.alphaMode !== "BLEND");
          const transparentMaterials = activeMaterials.filter(material => material.alphaMode === "BLEND");
          const faceCount = activePrimitives
              .map(primitive => {
                  let verticesCount = 0;
                  if(primitive.indices !== undefined)
                  {
                      verticesCount = state.gltf.accessors[primitive.indices].count;
                  }
                  if (verticesCount === 0)
                  {
                      return 0;
                  }

                  // convert vertex count to point, line or triangle count
                  switch (primitive.mode) {
                  case GL.POINTS:
                      return verticesCount;
                  case GL.LINES:
                      return verticesCount / 2;
                  case GL.LINE_LOOP:
                      return verticesCount;
                  case GL.LINE_STRIP:
                      return verticesCount - 1;
                  case GL.TRIANGLES:
                      return verticesCount / 3;
                  case GL.TRIANGLE_STRIP:
                  case GL.TRIANGLE_FAN:
                      return verticesCount - 2;
                  }
              })
              .reduce((acc, faceCount) => acc += faceCount);

          // assemble statistics object
          return {
              meshCount: activeMeshes.length,
              faceCount: faceCount,
              opaqueMaterialsCount: opaqueMaterials.length,
              transparentMaterialsCount: transparentMaterials.length
          };
      }

      _animate(state)
      {
          if(state.gltf === undefined)
          {
              return;
          }

          if(state.gltf.animations !== undefined && state.animationIndices !== undefined)
          {
              const disabledAnimations = state.gltf.animations.filter( (anim, index) => {
                  return false === state.animationIndices.includes(index);
              });

              for(const disabledAnimation of disabledAnimations)
              {
                  disabledAnimation.advance(state.gltf, undefined);
              }

              const t = state.animationTimer.elapsedSec();

              const animations = state.animationIndices.map(index => {
                  return state.gltf.animations[index];
              }).filter(animation => animation !== undefined);

              for(const animation of animations)
              {
                  animation.advance(state.gltf, t);
              }
          }
      }
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isFunction$1(x) {
      return typeof x === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config = {
      Promise: undefined,
      set useDeprecatedSynchronousErrorHandling(value) {
          if (value) {
              var error = /*@__PURE__*/ new Error();
              /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
          }
          _enable_super_gross_mode_that_will_cause_bad_things = value;
      },
      get useDeprecatedSynchronousErrorHandling() {
          return _enable_super_gross_mode_that_will_cause_bad_things;
      },
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function hostReportError(err) {
      setTimeout(function () { throw err; }, 0);
  }

  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
  var empty$1 = {
      closed: true,
      next: function (value) { },
      error: function (err) {
          if (config.useDeprecatedSynchronousErrorHandling) {
              throw err;
          }
          else {
              hostReportError(err);
          }
      },
      complete: function () { }
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArray$1 = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isObject$1(x) {
      return x !== null && typeof x === 'object';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
      function UnsubscriptionErrorImpl(errors) {
          Error.call(this);
          this.message = errors ?
              errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
          this.name = 'UnsubscriptionError';
          this.errors = errors;
          return this;
      }
      UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
      return UnsubscriptionErrorImpl;
  })();
  var UnsubscriptionError = UnsubscriptionErrorImpl;

  /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
  var Subscription = /*@__PURE__*/ (function () {
      function Subscription(unsubscribe) {
          this.closed = false;
          this._parentOrParents = null;
          this._subscriptions = null;
          if (unsubscribe) {
              this._ctorUnsubscribe = true;
              this._unsubscribe = unsubscribe;
          }
      }
      Subscription.prototype.unsubscribe = function () {
          var errors;
          if (this.closed) {
              return;
          }
          var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
          this.closed = true;
          this._parentOrParents = null;
          this._subscriptions = null;
          if (_parentOrParents instanceof Subscription) {
              _parentOrParents.remove(this);
          }
          else if (_parentOrParents !== null) {
              for (var index = 0; index < _parentOrParents.length; ++index) {
                  var parent_1 = _parentOrParents[index];
                  parent_1.remove(this);
              }
          }
          if (isFunction$1(_unsubscribe)) {
              if (_ctorUnsubscribe) {
                  this._unsubscribe = undefined;
              }
              try {
                  _unsubscribe.call(this);
              }
              catch (e) {
                  errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
              }
          }
          if (isArray$1(_subscriptions)) {
              var index = -1;
              var len = _subscriptions.length;
              while (++index < len) {
                  var sub = _subscriptions[index];
                  if (isObject$1(sub)) {
                      try {
                          sub.unsubscribe();
                      }
                      catch (e) {
                          errors = errors || [];
                          if (e instanceof UnsubscriptionError) {
                              errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                          }
                          else {
                              errors.push(e);
                          }
                      }
                  }
              }
          }
          if (errors) {
              throw new UnsubscriptionError(errors);
          }
      };
      Subscription.prototype.add = function (teardown) {
          var subscription = teardown;
          if (!teardown) {
              return Subscription.EMPTY;
          }
          switch (typeof teardown) {
              case 'function':
                  subscription = new Subscription(teardown);
              case 'object':
                  if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                      return subscription;
                  }
                  else if (this.closed) {
                      subscription.unsubscribe();
                      return subscription;
                  }
                  else if (!(subscription instanceof Subscription)) {
                      var tmp = subscription;
                      subscription = new Subscription();
                      subscription._subscriptions = [tmp];
                  }
                  break;
              default: {
                  throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
              }
          }
          var _parentOrParents = subscription._parentOrParents;
          if (_parentOrParents === null) {
              subscription._parentOrParents = this;
          }
          else if (_parentOrParents instanceof Subscription) {
              if (_parentOrParents === this) {
                  return subscription;
              }
              subscription._parentOrParents = [_parentOrParents, this];
          }
          else if (_parentOrParents.indexOf(this) === -1) {
              _parentOrParents.push(this);
          }
          else {
              return subscription;
          }
          var subscriptions = this._subscriptions;
          if (subscriptions === null) {
              this._subscriptions = [subscription];
          }
          else {
              subscriptions.push(subscription);
          }
          return subscription;
      };
      Subscription.prototype.remove = function (subscription) {
          var subscriptions = this._subscriptions;
          if (subscriptions) {
              var subscriptionIndex = subscriptions.indexOf(subscription);
              if (subscriptionIndex !== -1) {
                  subscriptions.splice(subscriptionIndex, 1);
              }
          }
      };
      Subscription.EMPTY = (function (empty) {
          empty.closed = true;
          return empty;
      }(new Subscription()));
      return Subscription;
  }());
  function flattenUnsubscriptionErrors(errors) {
      return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var rxSubscriber = /*@__PURE__*/ (function () {
      return typeof Symbol === 'function'
          ? /*@__PURE__*/ Symbol('rxSubscriber')
          : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
  })();

  /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
  var Subscriber = /*@__PURE__*/ (function (_super) {
      __extends(Subscriber, _super);
      function Subscriber(destinationOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this.syncErrorValue = null;
          _this.syncErrorThrown = false;
          _this.syncErrorThrowable = false;
          _this.isStopped = false;
          switch (arguments.length) {
              case 0:
                  _this.destination = empty$1;
                  break;
              case 1:
                  if (!destinationOrNext) {
                      _this.destination = empty$1;
                      break;
                  }
                  if (typeof destinationOrNext === 'object') {
                      if (destinationOrNext instanceof Subscriber) {
                          _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                          _this.destination = destinationOrNext;
                          destinationOrNext.add(_this);
                      }
                      else {
                          _this.syncErrorThrowable = true;
                          _this.destination = new SafeSubscriber(_this, destinationOrNext);
                      }
                      break;
                  }
              default:
                  _this.syncErrorThrowable = true;
                  _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                  break;
          }
          return _this;
      }
      Subscriber.prototype[rxSubscriber] = function () { return this; };
      Subscriber.create = function (next, error, complete) {
          var subscriber = new Subscriber(next, error, complete);
          subscriber.syncErrorThrowable = false;
          return subscriber;
      };
      Subscriber.prototype.next = function (value) {
          if (!this.isStopped) {
              this._next(value);
          }
      };
      Subscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              this.isStopped = true;
              this._error(err);
          }
      };
      Subscriber.prototype.complete = function () {
          if (!this.isStopped) {
              this.isStopped = true;
              this._complete();
          }
      };
      Subscriber.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.isStopped = true;
          _super.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function (value) {
          this.destination.next(value);
      };
      Subscriber.prototype._error = function (err) {
          this.destination.error(err);
          this.unsubscribe();
      };
      Subscriber.prototype._complete = function () {
          this.destination.complete();
          this.unsubscribe();
      };
      Subscriber.prototype._unsubscribeAndRecycle = function () {
          var _parentOrParents = this._parentOrParents;
          this._parentOrParents = null;
          this.unsubscribe();
          this.closed = false;
          this.isStopped = false;
          this._parentOrParents = _parentOrParents;
          return this;
      };
      return Subscriber;
  }(Subscription));
  var SafeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this._parentSubscriber = _parentSubscriber;
          var next;
          var context = _this;
          if (isFunction$1(observerOrNext)) {
              next = observerOrNext;
          }
          else if (observerOrNext) {
              next = observerOrNext.next;
              error = observerOrNext.error;
              complete = observerOrNext.complete;
              if (observerOrNext !== empty$1) {
                  context = Object.create(observerOrNext);
                  if (isFunction$1(context.unsubscribe)) {
                      _this.add(context.unsubscribe.bind(context));
                  }
                  context.unsubscribe = _this.unsubscribe.bind(_this);
              }
          }
          _this._context = context;
          _this._next = next;
          _this._error = error;
          _this._complete = complete;
          return _this;
      }
      SafeSubscriber.prototype.next = function (value) {
          if (!this.isStopped && this._next) {
              var _parentSubscriber = this._parentSubscriber;
              if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                  this.__tryOrUnsub(this._next, value);
              }
              else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
              if (this._error) {
                  if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(this._error, err);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, this._error, err);
                      this.unsubscribe();
                  }
              }
              else if (!_parentSubscriber.syncErrorThrowable) {
                  this.unsubscribe();
                  if (useDeprecatedSynchronousErrorHandling) {
                      throw err;
                  }
                  hostReportError(err);
              }
              else {
                  if (useDeprecatedSynchronousErrorHandling) {
                      _parentSubscriber.syncErrorValue = err;
                      _parentSubscriber.syncErrorThrown = true;
                  }
                  else {
                      hostReportError(err);
                  }
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.complete = function () {
          var _this = this;
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              if (this._complete) {
                  var wrappedComplete = function () { return _this._complete.call(_this._context); };
                  if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(wrappedComplete);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                      this.unsubscribe();
                  }
              }
              else {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              this.unsubscribe();
              if (config.useDeprecatedSynchronousErrorHandling) {
                  throw err;
              }
              else {
                  hostReportError(err);
              }
          }
      };
      SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
          if (!config.useDeprecatedSynchronousErrorHandling) {
              throw new Error('bad call');
          }
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              if (config.useDeprecatedSynchronousErrorHandling) {
                  parent.syncErrorValue = err;
                  parent.syncErrorThrown = true;
                  return true;
              }
              else {
                  hostReportError(err);
                  return true;
              }
          }
          return false;
      };
      SafeSubscriber.prototype._unsubscribe = function () {
          var _parentSubscriber = this._parentSubscriber;
          this._context = null;
          this._parentSubscriber = null;
          _parentSubscriber.unsubscribe();
      };
      return SafeSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
  function canReportError(observer) {
      while (observer) {
          var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
          if (closed_1 || isStopped) {
              return false;
          }
          else if (destination && destination instanceof Subscriber) {
              observer = destination;
          }
          else {
              observer = null;
          }
      }
      return true;
  }

  /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
  function toSubscriber(nextOrObserver, error, complete) {
      if (nextOrObserver) {
          if (nextOrObserver instanceof Subscriber) {
              return nextOrObserver;
          }
          if (nextOrObserver[rxSubscriber]) {
              return nextOrObserver[rxSubscriber]();
          }
      }
      if (!nextOrObserver && !error && !complete) {
          return new Subscriber(empty$1);
      }
      return new Subscriber(nextOrObserver, error, complete);
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function identity$1(x) {
      return x;
  }

  /** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
  function pipeFromArray(fns) {
      if (fns.length === 0) {
          return identity$1;
      }
      if (fns.length === 1) {
          return fns[0];
      }
      return function piped(input) {
          return fns.reduce(function (prev, fn) { return fn(prev); }, input);
      };
  }

  /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
  var Observable = /*@__PURE__*/ (function () {
      function Observable(subscribe) {
          this._isScalar = false;
          if (subscribe) {
              this._subscribe = subscribe;
          }
      }
      Observable.prototype.lift = function (operator) {
          var observable = new Observable();
          observable.source = this;
          observable.operator = operator;
          return observable;
      };
      Observable.prototype.subscribe = function (observerOrNext, error, complete) {
          var operator = this.operator;
          var sink = toSubscriber(observerOrNext, error, complete);
          if (operator) {
              sink.add(operator.call(sink, this.source));
          }
          else {
              sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                  this._subscribe(sink) :
                  this._trySubscribe(sink));
          }
          if (config.useDeprecatedSynchronousErrorHandling) {
              if (sink.syncErrorThrowable) {
                  sink.syncErrorThrowable = false;
                  if (sink.syncErrorThrown) {
                      throw sink.syncErrorValue;
                  }
              }
          }
          return sink;
      };
      Observable.prototype._trySubscribe = function (sink) {
          try {
              return this._subscribe(sink);
          }
          catch (err) {
              if (config.useDeprecatedSynchronousErrorHandling) {
                  sink.syncErrorThrown = true;
                  sink.syncErrorValue = err;
              }
              if (canReportError(sink)) {
                  sink.error(err);
              }
              else {
                  console.warn(err);
              }
          }
      };
      Observable.prototype.forEach = function (next, promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var subscription;
              subscription = _this.subscribe(function (value) {
                  try {
                      next(value);
                  }
                  catch (err) {
                      reject(err);
                      if (subscription) {
                          subscription.unsubscribe();
                      }
                  }
              }, reject, resolve);
          });
      };
      Observable.prototype._subscribe = function (subscriber) {
          var source = this.source;
          return source && source.subscribe(subscriber);
      };
      Observable.prototype[observable] = function () {
          return this;
      };
      Observable.prototype.pipe = function () {
          var operations = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              operations[_i] = arguments[_i];
          }
          if (operations.length === 0) {
              return this;
          }
          return pipeFromArray(operations)(this);
      };
      Observable.prototype.toPromise = function (promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var value;
              _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
          });
      };
      Observable.create = function (subscribe) {
          return new Observable(subscribe);
      };
      return Observable;
  }());
  function getPromiseCtor(promiseCtor) {
      if (!promiseCtor) {
          promiseCtor =  Promise;
      }
      if (!promiseCtor) {
          throw new Error('no Promise impl found');
      }
      return promiseCtor;
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
      function ObjectUnsubscribedErrorImpl() {
          Error.call(this);
          this.message = 'object unsubscribed';
          this.name = 'ObjectUnsubscribedError';
          return this;
      }
      ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
      return ObjectUnsubscribedErrorImpl;
  })();
  var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
  var SubjectSubscription = /*@__PURE__*/ (function (_super) {
      __extends(SubjectSubscription, _super);
      function SubjectSubscription(subject, subscriber) {
          var _this = _super.call(this) || this;
          _this.subject = subject;
          _this.subscriber = subscriber;
          _this.closed = false;
          return _this;
      }
      SubjectSubscription.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.closed = true;
          var subject = this.subject;
          var observers = subject.observers;
          this.subject = null;
          if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
              return;
          }
          var subscriberIndex = observers.indexOf(this.subscriber);
          if (subscriberIndex !== -1) {
              observers.splice(subscriberIndex, 1);
          }
      };
      return SubjectSubscription;
  }(Subscription));

  /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
  var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SubjectSubscriber, _super);
      function SubjectSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          return _this;
      }
      return SubjectSubscriber;
  }(Subscriber));
  var Subject = /*@__PURE__*/ (function (_super) {
      __extends(Subject, _super);
      function Subject() {
          var _this = _super.call(this) || this;
          _this.observers = [];
          _this.closed = false;
          _this.isStopped = false;
          _this.hasError = false;
          _this.thrownError = null;
          return _this;
      }
      Subject.prototype[rxSubscriber] = function () {
          return new SubjectSubscriber(this);
      };
      Subject.prototype.lift = function (operator) {
          var subject = new AnonymousSubject(this, this);
          subject.operator = operator;
          return subject;
      };
      Subject.prototype.next = function (value) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          if (!this.isStopped) {
              var observers = this.observers;
              var len = observers.length;
              var copy = observers.slice();
              for (var i = 0; i < len; i++) {
                  copy[i].next(value);
              }
          }
      };
      Subject.prototype.error = function (err) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          this.hasError = true;
          this.thrownError = err;
          this.isStopped = true;
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) {
              copy[i].error(err);
          }
          this.observers.length = 0;
      };
      Subject.prototype.complete = function () {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          this.isStopped = true;
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) {
              copy[i].complete();
          }
          this.observers.length = 0;
      };
      Subject.prototype.unsubscribe = function () {
          this.isStopped = true;
          this.closed = true;
          this.observers = null;
      };
      Subject.prototype._trySubscribe = function (subscriber) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else {
              return _super.prototype._trySubscribe.call(this, subscriber);
          }
      };
      Subject.prototype._subscribe = function (subscriber) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription.EMPTY;
          }
          else if (this.isStopped) {
              subscriber.complete();
              return Subscription.EMPTY;
          }
          else {
              this.observers.push(subscriber);
              return new SubjectSubscription(this, subscriber);
          }
      };
      Subject.prototype.asObservable = function () {
          var observable = new Observable();
          observable.source = this;
          return observable;
      };
      Subject.create = function (destination, source) {
          return new AnonymousSubject(destination, source);
      };
      return Subject;
  }(Observable));
  var AnonymousSubject = /*@__PURE__*/ (function (_super) {
      __extends(AnonymousSubject, _super);
      function AnonymousSubject(destination, source) {
          var _this = _super.call(this) || this;
          _this.destination = destination;
          _this.source = source;
          return _this;
      }
      AnonymousSubject.prototype.next = function (value) {
          var destination = this.destination;
          if (destination && destination.next) {
              destination.next(value);
          }
      };
      AnonymousSubject.prototype.error = function (err) {
          var destination = this.destination;
          if (destination && destination.error) {
              this.destination.error(err);
          }
      };
      AnonymousSubject.prototype.complete = function () {
          var destination = this.destination;
          if (destination && destination.complete) {
              this.destination.complete();
          }
      };
      AnonymousSubject.prototype._subscribe = function (subscriber) {
          var source = this.source;
          if (source) {
              return this.source.subscribe(subscriber);
          }
          else {
              return Subscription.EMPTY;
          }
      };
      return AnonymousSubject;
  }(Subject));

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function refCount() {
      return function refCountOperatorFunction(source) {
          return source.lift(new RefCountOperator(source));
      };
  }
  var RefCountOperator = /*@__PURE__*/ (function () {
      function RefCountOperator(connectable) {
          this.connectable = connectable;
      }
      RefCountOperator.prototype.call = function (subscriber, source) {
          var connectable = this.connectable;
          connectable._refCount++;
          var refCounter = new RefCountSubscriber(subscriber, connectable);
          var subscription = source.subscribe(refCounter);
          if (!refCounter.closed) {
              refCounter.connection = connectable.connect();
          }
          return subscription;
      };
      return RefCountOperator;
  }());
  var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (!connectable) {
              this.connection = null;
              return;
          }
          this.connectable = null;
          var refCount = connectable._refCount;
          if (refCount <= 0) {
              this.connection = null;
              return;
          }
          connectable._refCount = refCount - 1;
          if (refCount > 1) {
              this.connection = null;
              return;
          }
          var connection = this.connection;
          var sharedConnection = connectable._connection;
          this.connection = null;
          if (sharedConnection && (!connection || sharedConnection === connection)) {
              sharedConnection.unsubscribe();
          }
      };
      return RefCountSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
  var ConnectableObservable = /*@__PURE__*/ (function (_super) {
      __extends(ConnectableObservable, _super);
      function ConnectableObservable(source, subjectFactory) {
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.subjectFactory = subjectFactory;
          _this._refCount = 0;
          _this._isComplete = false;
          return _this;
      }
      ConnectableObservable.prototype._subscribe = function (subscriber) {
          return this.getSubject().subscribe(subscriber);
      };
      ConnectableObservable.prototype.getSubject = function () {
          var subject = this._subject;
          if (!subject || subject.isStopped) {
              this._subject = this.subjectFactory();
          }
          return this._subject;
      };
      ConnectableObservable.prototype.connect = function () {
          var connection = this._connection;
          if (!connection) {
              this._isComplete = false;
              connection = this._connection = new Subscription();
              connection.add(this.source
                  .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
              if (connection.closed) {
                  this._connection = null;
                  connection = Subscription.EMPTY;
              }
          }
          return connection;
      };
      ConnectableObservable.prototype.refCount = function () {
          return refCount()(this);
      };
      return ConnectableObservable;
  }(Observable));
  var connectableObservableDescriptor = /*@__PURE__*/ (function () {
      var connectableProto = ConnectableObservable.prototype;
      return {
          operator: { value: null },
          _refCount: { value: 0, writable: true },
          _subject: { value: null, writable: true },
          _connection: { value: null, writable: true },
          _subscribe: { value: connectableProto._subscribe },
          _isComplete: { value: connectableProto._isComplete, writable: true },
          getSubject: { value: connectableProto.getSubject },
          connect: { value: connectableProto.connect },
          refCount: { value: connectableProto.refCount }
      };
  })();
  var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ConnectableSubscriber, _super);
      function ConnectableSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      ConnectableSubscriber.prototype._error = function (err) {
          this._unsubscribe();
          _super.prototype._error.call(this, err);
      };
      ConnectableSubscriber.prototype._complete = function () {
          this.connectable._isComplete = true;
          this._unsubscribe();
          _super.prototype._complete.call(this);
      };
      ConnectableSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (connectable) {
              this.connectable = null;
              var connection = connectable._connection;
              connectable._refCount = 0;
              connectable._subject = null;
              connectable._connection = null;
              if (connection) {
                  connection.unsubscribe();
              }
          }
      };
      return ConnectableSubscriber;
  }(SubjectSubscriber));

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isScheduler(value) {
      return value && typeof value.schedule === 'function';
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var subscribeToArray = function (array) {
      return function (subscriber) {
          for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
              subscriber.next(array[i]);
          }
          subscriber.complete();
      };
  };

  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
  function scheduleArray(input, scheduler) {
      return new Observable(function (subscriber) {
          var sub = new Subscription();
          var i = 0;
          sub.add(scheduler.schedule(function () {
              if (i === input.length) {
                  subscriber.complete();
                  return;
              }
              subscriber.next(input[i++]);
              if (!subscriber.closed) {
                  sub.add(this.schedule());
              }
          }));
          return sub;
      });
  }

  /** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
  function fromArray(input, scheduler) {
      if (!scheduler) {
          return new Observable(subscribeToArray(input));
      }
      else {
          return scheduleArray(input, scheduler);
      }
  }

  /** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */
  function of() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var scheduler = args[args.length - 1];
      if (isScheduler(scheduler)) {
          args.pop();
          return scheduleArray(args, scheduler);
      }
      else {
          return fromArray(args);
      }
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function noop() { }

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function map(project, thisArg) {
      return function mapOperation(source) {
          if (typeof project !== 'function') {
              throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
          }
          return source.lift(new MapOperator(project, thisArg));
      };
  }
  var MapOperator = /*@__PURE__*/ (function () {
      function MapOperator(project, thisArg) {
          this.project = project;
          this.thisArg = thisArg;
      }
      MapOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
      };
      return MapOperator;
  }());
  var MapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MapSubscriber, _super);
      function MapSubscriber(destination, project, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.count = 0;
          _this.thisArg = thisArg || _this;
          return _this;
      }
      MapSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.project.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return MapSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
  var subscribeToPromise = function (promise) {
      return function (subscriber) {
          promise.then(function (value) {
              if (!subscriber.closed) {
                  subscriber.next(value);
                  subscriber.complete();
              }
          }, function (err) { return subscriber.error(err); })
              .then(null, hostReportError);
          return subscriber;
      };
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function getSymbolIterator() {
      if (typeof Symbol !== 'function' || !Symbol.iterator) {
          return '@@iterator';
      }
      return Symbol.iterator;
  }
  var iterator = /*@__PURE__*/ getSymbolIterator();

  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
  var subscribeToIterable = function (iterable) {
      return function (subscriber) {
          var iterator$1 = iterable[iterator]();
          do {
              var item = void 0;
              try {
                  item = iterator$1.next();
              }
              catch (err) {
                  subscriber.error(err);
                  return subscriber;
              }
              if (item.done) {
                  subscriber.complete();
                  break;
              }
              subscriber.next(item.value);
              if (subscriber.closed) {
                  break;
              }
          } while (true);
          if (typeof iterator$1.return === 'function') {
              subscriber.add(function () {
                  if (iterator$1.return) {
                      iterator$1.return();
                  }
              });
          }
          return subscriber;
      };
  };

  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
  var subscribeToObservable = function (obj) {
      return function (subscriber) {
          var obs = obj[observable]();
          if (typeof obs.subscribe !== 'function') {
              throw new TypeError('Provided object does not correctly implement Symbol.observable');
          }
          else {
              return obs.subscribe(subscriber);
          }
      };
  };

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isPromise(value) {
      return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
  }

  /** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
  var subscribeTo = function (result) {
      if (!!result && typeof result[observable] === 'function') {
          return subscribeToObservable(result);
      }
      else if (isArrayLike(result)) {
          return subscribeToArray(result);
      }
      else if (isPromise(result)) {
          return subscribeToPromise(result);
      }
      else if (!!result && typeof result[iterator] === 'function') {
          return subscribeToIterable(result);
      }
      else {
          var value = isObject$1(result) ? 'an invalid object' : "'" + result + "'";
          var msg = "You provided " + value + " where a stream was expected."
              + ' You can provide an Observable, Promise, Array, or Iterable.';
          throw new TypeError(msg);
      }
  };

  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
  function scheduleObservable(input, scheduler) {
      return new Observable(function (subscriber) {
          var sub = new Subscription();
          sub.add(scheduler.schedule(function () {
              var observable$1 = input[observable]();
              sub.add(observable$1.subscribe({
                  next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                  error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                  complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
              }));
          }));
          return sub;
      });
  }

  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
  function schedulePromise(input, scheduler) {
      return new Observable(function (subscriber) {
          var sub = new Subscription();
          sub.add(scheduler.schedule(function () {
              return input.then(function (value) {
                  sub.add(scheduler.schedule(function () {
                      subscriber.next(value);
                      sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                  }));
              }, function (err) {
                  sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
              });
          }));
          return sub;
      });
  }

  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
  function scheduleIterable(input, scheduler) {
      if (!input) {
          throw new Error('Iterable cannot be null');
      }
      return new Observable(function (subscriber) {
          var sub = new Subscription();
          var iterator$1;
          sub.add(function () {
              if (iterator$1 && typeof iterator$1.return === 'function') {
                  iterator$1.return();
              }
          });
          sub.add(scheduler.schedule(function () {
              iterator$1 = input[iterator]();
              sub.add(scheduler.schedule(function () {
                  if (subscriber.closed) {
                      return;
                  }
                  var value;
                  var done;
                  try {
                      var result = iterator$1.next();
                      value = result.value;
                      done = result.done;
                  }
                  catch (err) {
                      subscriber.error(err);
                      return;
                  }
                  if (done) {
                      subscriber.complete();
                  }
                  else {
                      subscriber.next(value);
                      this.schedule();
                  }
              }));
          }));
          return sub;
      });
  }

  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
  function isInteropObservable(input) {
      return input && typeof input[observable] === 'function';
  }

  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
  function isIterable(input) {
      return input && typeof input[iterator] === 'function';
  }

  /** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */
  function scheduled(input, scheduler) {
      if (input != null) {
          if (isInteropObservable(input)) {
              return scheduleObservable(input, scheduler);
          }
          else if (isPromise(input)) {
              return schedulePromise(input, scheduler);
          }
          else if (isArrayLike(input)) {
              return scheduleArray(input, scheduler);
          }
          else if (isIterable(input) || typeof input === 'string') {
              return scheduleIterable(input, scheduler);
          }
      }
      throw new TypeError((input !== null && typeof input || input) + ' is not observable');
  }

  /** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
  function from(input, scheduler) {
      if (!scheduler) {
          if (input instanceof Observable) {
              return input;
          }
          return new Observable(subscribeTo(input));
      }
      else {
          return scheduled(input, scheduler);
      }
  }

  /** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_util_subscribeTo PURE_IMPORTS_END */
  var SimpleInnerSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SimpleInnerSubscriber, _super);
      function SimpleInnerSubscriber(parent) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          return _this;
      }
      SimpleInnerSubscriber.prototype._next = function (value) {
          this.parent.notifyNext(value);
      };
      SimpleInnerSubscriber.prototype._error = function (error) {
          this.parent.notifyError(error);
          this.unsubscribe();
      };
      SimpleInnerSubscriber.prototype._complete = function () {
          this.parent.notifyComplete();
          this.unsubscribe();
      };
      return SimpleInnerSubscriber;
  }(Subscriber));
  var SimpleOuterSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SimpleOuterSubscriber, _super);
      function SimpleOuterSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SimpleOuterSubscriber.prototype.notifyNext = function (innerValue) {
          this.destination.next(innerValue);
      };
      SimpleOuterSubscriber.prototype.notifyError = function (err) {
          this.destination.error(err);
      };
      SimpleOuterSubscriber.prototype.notifyComplete = function () {
          this.destination.complete();
      };
      return SimpleOuterSubscriber;
  }(Subscriber));
  function innerSubscribe(result, innerSubscriber) {
      if (innerSubscriber.closed) {
          return undefined;
      }
      if (result instanceof Observable) {
          return result.subscribe(innerSubscriber);
      }
      return subscribeTo(result)(innerSubscriber);
  }

  /** PURE_IMPORTS_START tslib,_map,_observable_from,_innerSubscribe PURE_IMPORTS_END */
  function mergeMap(project, resultSelector, concurrent) {
      if (concurrent === void 0) {
          concurrent = Number.POSITIVE_INFINITY;
      }
      if (typeof resultSelector === 'function') {
          return function (source) { return source.pipe(mergeMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
      }
      else if (typeof resultSelector === 'number') {
          concurrent = resultSelector;
      }
      return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
  }
  var MergeMapOperator = /*@__PURE__*/ (function () {
      function MergeMapOperator(project, concurrent) {
          if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
          }
          this.project = project;
          this.concurrent = concurrent;
      }
      MergeMapOperator.prototype.call = function (observer, source) {
          return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
      };
      return MergeMapOperator;
  }());
  var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MergeMapSubscriber, _super);
      function MergeMapSubscriber(destination, project, concurrent) {
          if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.concurrent = concurrent;
          _this.hasCompleted = false;
          _this.buffer = [];
          _this.active = 0;
          _this.index = 0;
          return _this;
      }
      MergeMapSubscriber.prototype._next = function (value) {
          if (this.active < this.concurrent) {
              this._tryNext(value);
          }
          else {
              this.buffer.push(value);
          }
      };
      MergeMapSubscriber.prototype._tryNext = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.active++;
          this._innerSub(result);
      };
      MergeMapSubscriber.prototype._innerSub = function (ish) {
          var innerSubscriber = new SimpleInnerSubscriber(this);
          var destination = this.destination;
          destination.add(innerSubscriber);
          var innerSubscription = innerSubscribe(ish, innerSubscriber);
          if (innerSubscription !== innerSubscriber) {
              destination.add(innerSubscription);
          }
      };
      MergeMapSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.active === 0 && this.buffer.length === 0) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      MergeMapSubscriber.prototype.notifyNext = function (innerValue) {
          this.destination.next(innerValue);
      };
      MergeMapSubscriber.prototype.notifyComplete = function () {
          var buffer = this.buffer;
          this.active--;
          if (buffer.length > 0) {
              this._next(buffer.shift());
          }
          else if (this.active === 0 && this.hasCompleted) {
              this.destination.complete();
          }
      };
      return MergeMapSubscriber;
  }(SimpleOuterSubscriber));

  /** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */
  function mergeAll(concurrent) {
      if (concurrent === void 0) {
          concurrent = Number.POSITIVE_INFINITY;
      }
      return mergeMap(identity$1, concurrent);
  }

  /** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */
  function concatAll() {
      return mergeAll(1);
  }

  /** PURE_IMPORTS_START _of,_operators_concatAll PURE_IMPORTS_END */
  function concat() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          observables[_i] = arguments[_i];
      }
      return concatAll()(of.apply(void 0, observables));
  }

  /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
  function fromEvent(target, eventName, options, resultSelector) {
      if (isFunction$1(options)) {
          resultSelector = options;
          options = undefined;
      }
      if (resultSelector) {
          return fromEvent(target, eventName, options).pipe(map(function (args) { return isArray$1(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
      }
      return new Observable(function (subscriber) {
          function handler(e) {
              if (arguments.length > 1) {
                  subscriber.next(Array.prototype.slice.call(arguments));
              }
              else {
                  subscriber.next(e);
              }
          }
          setupSubscription(target, eventName, handler, subscriber, options);
      });
  }
  function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
      var unsubscribe;
      if (isEventTarget(sourceObj)) {
          var source_1 = sourceObj;
          sourceObj.addEventListener(eventName, handler, options);
          unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
      }
      else if (isJQueryStyleEventEmitter(sourceObj)) {
          var source_2 = sourceObj;
          sourceObj.on(eventName, handler);
          unsubscribe = function () { return source_2.off(eventName, handler); };
      }
      else if (isNodeStyleEventEmitter(sourceObj)) {
          var source_3 = sourceObj;
          sourceObj.addListener(eventName, handler);
          unsubscribe = function () { return source_3.removeListener(eventName, handler); };
      }
      else if (sourceObj && sourceObj.length) {
          for (var i = 0, len = sourceObj.length; i < len; i++) {
              setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
          }
      }
      else {
          throw new TypeError('Invalid event target');
      }
      subscriber.add(unsubscribe);
  }
  function isNodeStyleEventEmitter(sourceObj) {
      return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
  }
  function isJQueryStyleEventEmitter(sourceObj) {
      return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
  }
  function isEventTarget(sourceObj) {
      return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
  }

  /** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */
  function merge$1() {
      var observables = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          observables[_i] = arguments[_i];
      }
      var concurrent = Number.POSITIVE_INFINITY;
      var scheduler = null;
      var last = observables[observables.length - 1];
      if (isScheduler(last)) {
          scheduler = observables.pop();
          if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
              concurrent = observables.pop();
          }
      }
      else if (typeof last === 'number') {
          concurrent = observables.pop();
      }
      if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable) {
          return observables[0];
      }
      return mergeAll(concurrent)(fromArray(observables, scheduler));
  }

  /** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
  var NEVER = /*@__PURE__*/ new Observable(noop);

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function filter(predicate, thisArg) {
      return function filterOperatorFunction(source) {
          return source.lift(new FilterOperator(predicate, thisArg));
      };
  }
  var FilterOperator = /*@__PURE__*/ (function () {
      function FilterOperator(predicate, thisArg) {
          this.predicate = predicate;
          this.thisArg = thisArg;
      }
      FilterOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
      };
      return FilterOperator;
  }());
  var FilterSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FilterSubscriber, _super);
      function FilterSubscriber(destination, predicate, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.thisArg = thisArg;
          _this.count = 0;
          return _this;
      }
      FilterSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.predicate.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (result) {
              this.destination.next(value);
          }
      };
      return FilterSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */
  function multicast(subjectOrSubjectFactory, selector) {
      return function multicastOperatorFunction(source) {
          var subjectFactory;
          if (typeof subjectOrSubjectFactory === 'function') {
              subjectFactory = subjectOrSubjectFactory;
          }
          else {
              subjectFactory = function subjectFactory() {
                  return subjectOrSubjectFactory;
              };
          }
          if (typeof selector === 'function') {
              return source.lift(new MulticastOperator(subjectFactory, selector));
          }
          var connectable = Object.create(source, connectableObservableDescriptor);
          connectable.source = source;
          connectable.subjectFactory = subjectFactory;
          return connectable;
      };
  }
  var MulticastOperator = /*@__PURE__*/ (function () {
      function MulticastOperator(subjectFactory, selector) {
          this.subjectFactory = subjectFactory;
          this.selector = selector;
      }
      MulticastOperator.prototype.call = function (subscriber, source) {
          var selector = this.selector;
          var subject = this.subjectFactory();
          var subscription = selector(subject).subscribe(subscriber);
          subscription.add(source.subscribe(subject));
          return subscription;
      };
      return MulticastOperator;
  }());

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function pairwise() {
      return function (source) { return source.lift(new PairwiseOperator()); };
  }
  var PairwiseOperator = /*@__PURE__*/ (function () {
      function PairwiseOperator() {
      }
      PairwiseOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new PairwiseSubscriber(subscriber));
      };
      return PairwiseOperator;
  }());
  var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(PairwiseSubscriber, _super);
      function PairwiseSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasPrev = false;
          return _this;
      }
      PairwiseSubscriber.prototype._next = function (value) {
          var pair;
          if (this.hasPrev) {
              pair = [this.prev, value];
          }
          else {
              this.hasPrev = true;
          }
          this.prev = value;
          if (pair) {
              this.destination.next(pair);
          }
      };
      return PairwiseSubscriber;
  }(Subscriber));

  /** PURE_IMPORTS_START _map PURE_IMPORTS_END */
  function pluck() {
      var properties = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          properties[_i] = arguments[_i];
      }
      var length = properties.length;
      if (length === 0) {
          throw new Error('list of properties cannot be empty.');
      }
      return function (source) { return map(plucker(properties, length))(source); };
  }
  function plucker(props, length) {
      var mapper = function (x) {
          var currentProp = x;
          for (var i = 0; i < length; i++) {
              var p = currentProp != null ? currentProp[props[i]] : undefined;
              if (p !== void 0) {
                  currentProp = p;
              }
              else {
                  return undefined;
              }
          }
          return currentProp;
      };
      return mapper;
  }

  /** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */
  function shareSubjectFactory() {
      return new Subject();
  }
  function share() {
      return function (source) { return refCount()(multicast(shareSubjectFactory)(source)); };
  }

  /** PURE_IMPORTS_START _observable_concat,_util_isScheduler PURE_IMPORTS_END */
  function startWith() {
      var array = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          array[_i] = arguments[_i];
      }
      var scheduler = array[array.length - 1];
      if (isScheduler(scheduler)) {
          array.pop();
          return function (source) { return concat(array, source, scheduler); };
      }
      else {
          return function (source) { return concat(array, source); };
      }
  }

  /** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */
  function takeUntil(notifier) {
      return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
  }
  var TakeUntilOperator = /*@__PURE__*/ (function () {
      function TakeUntilOperator(notifier) {
          this.notifier = notifier;
      }
      TakeUntilOperator.prototype.call = function (subscriber, source) {
          var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
          var notifierSubscription = innerSubscribe(this.notifier, new SimpleInnerSubscriber(takeUntilSubscriber));
          if (notifierSubscription && !takeUntilSubscriber.seenValue) {
              takeUntilSubscriber.add(notifierSubscription);
              return source.subscribe(takeUntilSubscriber);
          }
          return takeUntilSubscriber;
      };
      return TakeUntilOperator;
  }());
  var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeUntilSubscriber, _super);
      function TakeUntilSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.seenValue = false;
          return _this;
      }
      TakeUntilSubscriber.prototype.notifyNext = function () {
          this.seenValue = true;
          this.complete();
      };
      TakeUntilSubscriber.prototype.notifyComplete = function () {
      };
      return TakeUntilSubscriber;
  }(SimpleOuterSubscriber));

  var e=[0,1,2,3,4,4,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,0,16,17,18,18,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29];function t(){var e=this;function t(e,t){var n=0;do{n|=1&e,e>>>=1,n<<=1;}while(--t>0);return n>>>1}e.build_tree=function(n){var i,r,a,o=e.dyn_tree,s=e.stat_desc.static_tree,l=e.stat_desc.elems,f=-1;for(n.heap_len=0,n.heap_max=573,i=0;i<l;i++)0!==o[2*i]?(n.heap[++n.heap_len]=f=i,n.depth[i]=0):o[2*i+1]=0;for(;n.heap_len<2;)o[2*(a=n.heap[++n.heap_len]=f<2?++f:0)]=1,n.depth[a]=0,n.opt_len--,s&&(n.static_len-=s[2*a+1]);for(e.max_code=f,i=Math.floor(n.heap_len/2);i>=1;i--)n.pqdownheap(o,i);a=l;do{i=n.heap[1],n.heap[1]=n.heap[n.heap_len--],n.pqdownheap(o,1),r=n.heap[1],n.heap[--n.heap_max]=i,n.heap[--n.heap_max]=r,o[2*a]=o[2*i]+o[2*r],n.depth[a]=Math.max(n.depth[i],n.depth[r])+1,o[2*i+1]=o[2*r+1]=a,n.heap[1]=a++,n.pqdownheap(o,1);}while(n.heap_len>=2);n.heap[--n.heap_max]=n.heap[1],function(t){var n,i,r,a,o,s,l=e.dyn_tree,f=e.stat_desc.static_tree,u=e.stat_desc.extra_bits,d=e.stat_desc.extra_base,c=e.stat_desc.max_length,_=0;for(a=0;a<=15;a++)t.bl_count[a]=0;for(l[2*t.heap[t.heap_max]+1]=0,n=t.heap_max+1;n<573;n++)(a=l[2*l[2*(i=t.heap[n])+1]+1]+1)>c&&(a=c,_++),l[2*i+1]=a,i>e.max_code||(t.bl_count[a]++,o=0,i>=d&&(o=u[i-d]),t.opt_len+=(s=l[2*i])*(a+o),f&&(t.static_len+=s*(f[2*i+1]+o)));if(0!==_){do{for(a=c-1;0===t.bl_count[a];)a--;t.bl_count[a]--,t.bl_count[a+1]+=2,t.bl_count[c]--,_-=2;}while(_>0);for(a=c;0!==a;a--)for(i=t.bl_count[a];0!==i;)(r=t.heap[--n])>e.max_code||(l[2*r+1]!=a&&(t.opt_len+=(a-l[2*r+1])*l[2*r],l[2*r+1]=a),i--);}}(n),function(e,n,i){var r,a,o,s=[],l=0;for(r=1;r<=15;r++)s[r]=l=l+i[r-1]<<1;for(a=0;a<=n;a++)0!==(o=e[2*a+1])&&(e[2*a]=t(s[o]++,o));}(o,e.max_code,n.bl_count);};}function n(e,t,n,i,r){var a=this;a.static_tree=e,a.extra_bits=t,a.extra_base=n,a.elems=i,a.max_length=r;}function i(e,t,n,i,r){var a=this;a.good_length=e,a.max_lazy=t,a.nice_length=n,a.max_chain=i,a.func=r;}t._length_code=[0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28],t.base_length=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],t.base_dist=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],t.d_code=function(t){return t<256?e[t]:e[256+(t>>>7)]},t.extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],t.extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],t.bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],n.static_ltree=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],n.static_dtree=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],n.static_l_desc=new n(n.static_ltree,t.extra_lbits,257,286,15),n.static_d_desc=new n(n.static_dtree,t.extra_dbits,0,30,15),n.static_bl_desc=new n(null,t.extra_blbits,0,19,7);var r=[new i(0,0,0,0,0),new i(4,4,8,4,1),new i(4,5,16,8,1),new i(4,6,32,32,1),new i(4,4,16,16,2),new i(8,16,32,32,2),new i(8,16,128,128,2),new i(8,32,128,256,2),new i(32,128,258,1024,2),new i(32,258,258,4096,2)],a=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function o(e,t,n,i){var r=e[2*t],a=e[2*n];return r<a||r==a&&i[t]<=i[n]}function s(){var e,i,s,l,f,u,d,c,_,h,p,w,v,b,x,m,g,y,k,U,z,E,D,A,S,R,F,T,W,M,B,I,C,L,P,Z,N,j,O,V,q,$=this,G=new t,H=new t,Y=new t;function J(){var e;for(e=0;e<286;e++)B[2*e]=0;for(e=0;e<30;e++)I[2*e]=0;for(e=0;e<19;e++)C[2*e]=0;B[512]=1,$.opt_len=$.static_len=0,Z=j=0;}function K(e,t){var n,i,r=-1,a=e[1],o=0,s=7,l=4;for(0===a&&(s=138,l=3),e[2*(t+1)+1]=65535,n=0;n<=t;n++)i=a,a=e[2*(n+1)+1],++o<s&&i==a||(o<l?C[2*i]+=o:0!==i?(i!=r&&C[2*i]++,C[32]++):o<=10?C[34]++:C[36]++,o=0,r=i,0===a?(s=138,l=3):i==a?(s=6,l=3):(s=7,l=4));}function Q(e){$.pending_buf[$.pending++]=e;}function X(e){Q(255&e),Q(e>>>8&255);}function ee(e,t){var n,i=t;q>16-i?(X(V|=(n=e)<<q&65535),V=n>>>16-q,q+=i-16):(V|=e<<q&65535,q+=i);}function te(e,t){var n=2*e;ee(65535&t[n],65535&t[n+1]);}function ne(e,t){var n,i,r=-1,a=e[1],o=0,s=7,l=4;for(0===a&&(s=138,l=3),n=0;n<=t;n++)if(i=a,a=e[2*(n+1)+1],!(++o<s&&i==a)){if(o<l)do{te(i,C);}while(0!=--o);else 0!==i?(i!=r&&(te(i,C),o--),te(16,C),ee(o-3,2)):o<=10?(te(17,C),ee(o-3,3)):(te(18,C),ee(o-11,7));o=0,r=i,0===a?(s=138,l=3):i==a?(s=6,l=3):(s=7,l=4);}}function ie(){16==q?(X(V),V=0,q=0):q>=8&&(Q(255&V),V>>>=8,q-=8);}function re(e,n){var i,r,a;if($.pending_buf[N+2*Z]=e>>>8&255,$.pending_buf[N+2*Z+1]=255&e,$.pending_buf[L+Z]=255&n,Z++,0===e?B[2*n]++:(j++,e--,B[2*(t._length_code[n]+256+1)]++,I[2*t.d_code(e)]++),0==(8191&Z)&&F>2){for(i=8*Z,r=z-g,a=0;a<30;a++)i+=I[2*a]*(5+t.extra_dbits[a]);if(i>>>=3,j<Math.floor(Z/2)&&i<Math.floor(r/2))return !0}return Z==P-1}function ae(e,n){var i,r,a,o,s=0;if(0!==Z)do{i=$.pending_buf[N+2*s]<<8&65280|255&$.pending_buf[N+2*s+1],r=255&$.pending_buf[L+s],s++,0===i?te(r,e):(te((a=t._length_code[r])+256+1,e),0!==(o=t.extra_lbits[a])&&ee(r-=t.base_length[a],o),i--,te(a=t.d_code(i),n),0!==(o=t.extra_dbits[a])&&ee(i-=t.base_dist[a],o));}while(s<Z);te(256,e),O=e[513];}function oe(){q>8?X(V):q>0&&Q(255&V),V=0,q=0;}function se(e,t,n){ee(0+(n?1:0),3),function(e,t,n){oe(),O=8,X(t),X(~t),$.pending_buf.set(c.subarray(e,e+t),$.pending),$.pending+=t;}(e,t);}function le(i){(function(e,i,r){var a,o,s=0;F>0?(G.build_tree($),H.build_tree($),s=function(){var e;for(K(B,G.max_code),K(I,H.max_code),Y.build_tree($),e=18;e>=3&&0===C[2*t.bl_order[e]+1];e--);return $.opt_len+=3*(e+1)+5+5+4,e}(),(o=$.static_len+3+7>>>3)<=(a=$.opt_len+3+7>>>3)&&(a=o)):a=o=i+5,i+4<=a&&-1!=e?se(e,i,r):o==a?(ee(2+(r?1:0),3),ae(n.static_ltree,n.static_dtree)):(ee(4+(r?1:0),3),function(e,n,i){var r;for(ee(e-257,5),ee(n-1,5),ee(i-4,4),r=0;r<i;r++)ee(C[2*t.bl_order[r]+1],3);ne(B,e-1),ne(I,n-1);}(G.max_code+1,H.max_code+1,s+1),ae(B,I)),J(),r&&oe();})(g>=0?g:-1,z-g,i),g=z,e.flush_pending();}function fe(){var t,n,i,r;do{if(0==(r=_-D-z)&&0===z&&0===D)r=f;else if(-1==r)r--;else if(z>=f+f-262){c.set(c.subarray(f,f+f),0),E-=f,z-=f,g-=f,i=t=v;do{n=65535&p[--i],p[i]=n>=f?n-f:0;}while(0!=--t);i=t=f;do{n=65535&h[--i],h[i]=n>=f?n-f:0;}while(0!=--t);r+=f;}if(0===e.avail_in)return;t=e.read_buf(c,z+D,r),(D+=t)>=3&&(w=((w=255&c[z])<<m^255&c[z+1])&x);}while(D<262&&0!==e.avail_in)}function ue(e){var t,n,i=S,r=z,a=A,o=z>f-262?z-(f-262):0,s=M,l=d,u=z+258,_=c[r+a-1],p=c[r+a];A>=W&&(i>>=2),s>D&&(s=D);do{if(c[(t=e)+a]==p&&c[t+a-1]==_&&c[t]==c[r]&&c[++t]==c[r+1]){r+=2,t++;do{}while(c[++r]==c[++t]&&c[++r]==c[++t]&&c[++r]==c[++t]&&c[++r]==c[++t]&&c[++r]==c[++t]&&c[++r]==c[++t]&&c[++r]==c[++t]&&c[++r]==c[++t]&&r<u);if(n=258-(u-r),r=u-258,n>a){if(E=e,a=n,n>=s)break;_=c[r+a-1],p=c[r+a];}}}while((e=65535&h[e&l])>o&&0!=--i);return a<=D?a:D}$.depth=[],$.bl_count=[],$.heap=[],B=[],I=[],C=[],$.pqdownheap=function(e,t){for(var n=$.heap,i=n[t],r=t<<1;r<=$.heap_len&&(r<$.heap_len&&o(e,n[r+1],n[r],$.depth)&&r++,!o(e,i,n[r],$.depth));)n[t]=n[r],t=r,r<<=1;n[t]=i;},$.deflateInit=function(e,t,a,o,k,E){return o||(o=8),k||(k=8),E||(E=0),e.msg=null,-1==t&&(t=6),k<1||k>9||8!=o||a<9||a>15||t<0||t>9||E<0||E>2?-2:(e.dstate=$,d=(f=1<<(u=a))-1,x=(v=1<<(b=k+7))-1,m=Math.floor((b+3-1)/3),c=new Uint8Array(2*f),h=[],p=[],P=1<<k+6,$.pending_buf=new Uint8Array(4*P),s=4*P,N=Math.floor(P/2),L=3*P,F=t,T=E,function(e){return e.total_in=e.total_out=0,e.msg=null,$.pending=0,$.pending_out=0,i=113,l=0,G.dyn_tree=B,G.stat_desc=n.static_l_desc,H.dyn_tree=I,H.stat_desc=n.static_d_desc,Y.dyn_tree=C,Y.stat_desc=n.static_bl_desc,V=0,q=0,O=8,J(),function(){var e;for(_=2*f,p[v-1]=0,e=0;e<v-1;e++)p[e]=0;R=r[F].max_lazy,W=r[F].good_length,M=r[F].nice_length,S=r[F].max_chain,z=0,g=0,D=0,y=A=2,U=0,w=0;}(),0}(e))},$.deflateEnd=function(){return 42!=i&&113!=i&&666!=i?-2:($.pending_buf=null,p=null,h=null,c=null,$.dstate=null,113==i?-3:0)},$.deflateParams=function(e,t,n){var i=0;return -1==t&&(t=6),t<0||t>9||n<0||n>2?-2:(r[F].func!=r[t].func&&0!==e.total_in&&(i=e.deflate(1)),F!=t&&(R=r[F=t].max_lazy,W=r[F].good_length,M=r[F].nice_length,S=r[F].max_chain),T=n,i)},$.deflateSetDictionary=function(e,t,n){var r,a=n,o=0;if(!t||42!=i)return -2;if(a<3)return 0;for(a>f-262&&(o=n-(a=f-262)),c.set(t.subarray(o,o+a),0),z=a,g=a,w=((w=255&c[0])<<m^255&c[1])&x,r=0;r<=a-3;r++)h[r&d]=p[w=(w<<m^255&c[r+2])&x],p[w]=r;return 0},$.deflate=function(t,o){var _,b,S,W,M,B;if(o>4||o<0)return -2;if(!t.next_out||!t.next_in&&0!==t.avail_in||666==i&&4!=o)return t.msg=a[4],-2;if(0===t.avail_out)return t.msg=a[7],-5;if(e=t,W=l,l=o,42==i&&(b=8+(u-8<<4)<<8,(S=(F-1&255)>>1)>3&&(S=3),b|=S<<6,0!==z&&(b|=32),i=113,Q((B=b+=31-b%31)>>8&255),Q(255&B)),0!==$.pending){if(e.flush_pending(),0===e.avail_out)return l=-1,0}else if(0===e.avail_in&&o<=W&&4!=o)return e.msg=a[7],-5;if(666==i&&0!==e.avail_in)return t.msg=a[7],-5;if(0!==e.avail_in||0!==D||0!=o&&666!=i){switch(M=-1,r[F].func){case 0:M=function(t){var n,i=65535;for(i>s-5&&(i=s-5);;){if(D<=1){if(fe(),0===D&&0==t)return 0;if(0===D)break}if(z+=D,D=0,n=g+i,(0===z||z>=n)&&(D=z-n,z=n,le(!1),0===e.avail_out))return 0;if(z-g>=f-262&&(le(!1),0===e.avail_out))return 0}return le(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(o);break;case 1:M=function(t){for(var n,i=0;;){if(D<262){if(fe(),D<262&&0==t)return 0;if(0===D)break}if(D>=3&&(i=65535&p[w=(w<<m^255&c[z+2])&x],h[z&d]=p[w],p[w]=z),0!==i&&(z-i&65535)<=f-262&&2!=T&&(y=ue(i)),y>=3)if(n=re(z-E,y-3),D-=y,y<=R&&D>=3){y--;do{z++,i=65535&p[w=(w<<m^255&c[z+2])&x],h[z&d]=p[w],p[w]=z;}while(0!=--y);z++;}else z+=y,y=0,w=((w=255&c[z])<<m^255&c[z+1])&x;else n=re(0,255&c[z]),D--,z++;if(n&&(le(!1),0===e.avail_out))return 0}return le(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(o);break;case 2:M=function(t){for(var n,i,r=0;;){if(D<262){if(fe(),D<262&&0==t)return 0;if(0===D)break}if(D>=3&&(r=65535&p[w=(w<<m^255&c[z+2])&x],h[z&d]=p[w],p[w]=z),A=y,k=E,y=2,0!==r&&A<R&&(z-r&65535)<=f-262&&(2!=T&&(y=ue(r)),y<=5&&(1==T||3==y&&z-E>4096)&&(y=2)),A>=3&&y<=A){i=z+D-3,n=re(z-1-k,A-3),D-=A-1,A-=2;do{++z<=i&&(r=65535&p[w=(w<<m^255&c[z+2])&x],h[z&d]=p[w],p[w]=z);}while(0!=--A);if(U=0,y=2,z++,n&&(le(!1),0===e.avail_out))return 0}else if(0!==U){if((n=re(0,255&c[z-1]))&&le(!1),z++,D--,0===e.avail_out)return 0}else U=1,z++,D--;}return 0!==U&&(n=re(0,255&c[z-1]),U=0),le(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(o);}if(2!=M&&3!=M||(i=666),0==M||2==M)return 0===e.avail_out&&(l=-1),0;if(1==M){if(1==o)ee(2,3),te(256,n.static_ltree),ie(),1+O+10-q<9&&(ee(2,3),te(256,n.static_ltree),ie()),O=7;else if(se(0,0,!1),3==o)for(_=0;_<v;_++)p[_]=0;if(e.flush_pending(),0===e.avail_out)return l=-1,0}}return 4!=o?0:1};}function l(){var e=this;e.next_in_index=0,e.next_out_index=0,e.avail_in=0,e.total_in=0,e.avail_out=0,e.total_out=0;}function f(e){var t=new l,n=512,i=new Uint8Array(n),r=e?e.level:-1;void 0===r&&(r=-1),t.deflateInit(r),t.next_out=i,this.append=function(e,r){var a,o=[],s=0,l=0,f=0;if(e.length){t.next_in_index=0,t.next_in=e,t.avail_in=e.length;do{if(t.next_out_index=0,t.avail_out=n,0!=t.deflate(0))throw new Error("deflating: "+t.msg);t.next_out_index&&o.push(t.next_out_index==n?new Uint8Array(i):new Uint8Array(i.subarray(0,t.next_out_index))),f+=t.next_out_index,r&&t.next_in_index>0&&t.next_in_index!=s&&(r(t.next_in_index),s=t.next_in_index);}while(t.avail_in>0||0===t.avail_out);return a=new Uint8Array(f),o.forEach(function(e){a.set(e,l),l+=e.length;}),a}},this.flush=function(){var e,r,a=[],o=0,s=0;do{if(t.next_out_index=0,t.avail_out=n,1!=(e=t.deflate(4))&&0!=e)throw new Error("deflating: "+t.msg);n-t.avail_out>0&&a.push(new Uint8Array(i.subarray(0,t.next_out_index))),s+=t.next_out_index;}while(t.avail_in>0||0===t.avail_out);return t.deflateEnd(),r=new Uint8Array(s),a.forEach(function(e){r.set(e,o),o+=e.length;}),r};}l.prototype={deflateInit:function(e,t){var n=this;return n.dstate=new s,t||(t=15),n.dstate.deflateInit(n,e,t)},deflate:function(e){var t=this;return t.dstate?t.dstate.deflate(t,e):-2},deflateEnd:function(){var e=this;if(!e.dstate)return -2;var t=e.dstate.deflateEnd();return e.dstate=null,t},deflateParams:function(e,t){var n=this;return n.dstate?n.dstate.deflateParams(n,e,t):-2},deflateSetDictionary:function(e,t){var n=this;return n.dstate?n.dstate.deflateSetDictionary(n,e,t):-2},read_buf:function(e,t,n){var i=this,r=i.avail_in;return r>n&&(r=n),0===r?0:(i.avail_in-=r,e.set(i.next_in.subarray(i.next_in_index,i.next_in_index+r),t),i.next_in_index+=r,i.total_in+=r,r)},flush_pending:function(){var e=this,t=e.dstate.pending;t>e.avail_out&&(t=e.avail_out),0!==t&&(e.next_out.set(e.dstate.pending_buf.subarray(e.dstate.pending_out,e.dstate.pending_out+t),e.next_out_index),e.next_out_index+=t,e.dstate.pending_out+=t,e.total_out+=t,e.avail_out-=t,e.dstate.pending-=t,0===e.dstate.pending&&(e.dstate.pending_out=0));}},self._zipjs_Deflater=f;var u=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],d=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],c=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],_=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],h=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],p=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],w=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function v(){var e,t,n,i,r,a;function o(e,t,o,s,l,f,u,d,c,_,h){var p,w,v,b,x,m,g,y,k,U,z,E,D,A,S;U=0,x=o;do{n[e[t+U]]++,U++,x--;}while(0!==x);if(n[0]==o)return u[0]=-1,d[0]=0,0;for(y=d[0],m=1;m<=15&&0===n[m];m++);for(g=m,y<m&&(y=m),x=15;0!==x&&0===n[x];x--);for(v=x,y>x&&(y=x),d[0]=y,A=1<<m;m<x;m++,A<<=1)if((A-=n[m])<0)return -3;if((A-=n[x])<0)return -3;for(n[x]+=A,a[1]=m=0,U=1,D=2;0!=--x;)a[D]=m+=n[U],D++,U++;x=0,U=0;do{0!==(m=e[t+U])&&(h[a[m]++]=x),U++;}while(++x<o);for(o=a[v],a[0]=x=0,U=0,b=-1,E=-y,r[0]=0,z=0,S=0;g<=v;g++)for(p=n[g];0!=p--;){for(;g>E+y;){if(b++,S=(S=v-(E+=y))>y?y:S,(w=1<<(m=g-E))>p+1&&(w-=p+1,D=g,m<S))for(;++m<S&&!((w<<=1)<=n[++D]);)w-=n[D];if(_[0]+(S=1<<m)>1440)return -3;r[b]=z=_[0],_[0]+=S,0!==b?(a[b]=x,i[0]=m,i[1]=y,i[2]=z-r[b-1]-(m=x>>>E-y),c.set(i,3*(r[b-1]+m))):u[0]=z;}for(i[1]=g-E,U>=o?i[0]=192:h[U]<s?(i[0]=h[U]<256?0:96,i[2]=h[U++]):(i[0]=f[h[U]-s]+16+64,i[2]=l[h[U++]-s]),w=1<<g-E,m=x>>>E;m<S;m+=w)c.set(i,3*(z+m));for(m=1<<g-1;0!=(x&m);m>>>=1)x^=m;for(x^=m,k=(1<<E)-1;(x&k)!=a[b];)b--,k=(1<<(E-=y))-1;}return 0!==A&&1!=v?-5:0}function s(o){var s;for(e||(e=[],t=[],n=new Int32Array(16),i=[],r=new Int32Array(15),a=new Int32Array(16)),t.length<o&&(t=[]),s=0;s<o;s++)t[s]=0;for(s=0;s<16;s++)n[s]=0;for(s=0;s<3;s++)i[s]=0;r.set(n.subarray(0,15),0),a.set(n.subarray(0,16),0);}this.inflate_trees_bits=function(n,i,r,a,l){var f;return s(19),e[0]=0,-3==(f=o(n,0,19,19,null,null,r,i,a,e,t))?l.msg="oversubscribed dynamic bit lengths tree":-5!=f&&0!==i[0]||(l.msg="incomplete dynamic bit lengths tree",f=-3),f},this.inflate_trees_dynamic=function(n,i,r,a,l,f,u,d,c){var v;return s(288),e[0]=0,0!=(v=o(r,0,n,257,_,h,f,a,d,e,t))||0===a[0]?(-3==v?c.msg="oversubscribed literal/length tree":-4!=v&&(c.msg="incomplete literal/length tree",v=-3),v):(s(288),0!=(v=o(r,n,i,0,p,w,u,l,d,e,t))||0===l[0]&&n>257?(-3==v?c.msg="oversubscribed distance tree":-5==v?(c.msg="incomplete distance tree",v=-3):-4!=v&&(c.msg="empty distance tree with lengths",v=-3),v):0)};}function b(){var e,t,n,i,r=this,a=0,o=0,s=0,l=0,f=0,d=0,c=0,_=0,h=0,p=0;function w(e,t,n,i,r,a,o,s){var l,f,d,c,_,h,p,w,v,b,x,m,g,y,k,U;p=s.next_in_index,w=s.avail_in,_=o.bitb,h=o.bitk,b=(v=o.write)<o.read?o.read-v-1:o.end-v,x=u[e],m=u[t];do{for(;h<20;)w--,_|=(255&s.read_byte(p++))<<h,h+=8;if(0!==(c=(f=n)[U=3*((d=i)+(l=_&x))]))for(;;){if(_>>=f[U+1],h-=f[U+1],0!=(16&c)){for(g=f[U+2]+(_&u[c&=15]),_>>=c,h-=c;h<15;)w--,_|=(255&s.read_byte(p++))<<h,h+=8;for(c=(f=r)[U=3*((d=a)+(l=_&m))];;){if(_>>=f[U+1],h-=f[U+1],0!=(16&c)){for(c&=15;h<c;)w--,_|=(255&s.read_byte(p++))<<h,h+=8;if(y=f[U+2]+(_&u[c]),_>>=c,h-=c,b-=g,v>=y)v-(k=v-y)>0&&2>v-k?(o.window[v++]=o.window[k++],o.window[v++]=o.window[k++],g-=2):(o.window.set(o.window.subarray(k,k+2),v),v+=2,k+=2,g-=2);else {k=v-y;do{k+=o.end;}while(k<0);if(g>(c=o.end-k)){if(g-=c,v-k>0&&c>v-k)do{o.window[v++]=o.window[k++];}while(0!=--c);else o.window.set(o.window.subarray(k,k+c),v),v+=c,k+=c,c=0;k=0;}}if(v-k>0&&g>v-k)do{o.window[v++]=o.window[k++];}while(0!=--g);else o.window.set(o.window.subarray(k,k+g),v),v+=g,k+=g,g=0;break}if(0!=(64&c))return s.msg="invalid distance code",w+=g=h>>3<(g=s.avail_in-w)?h>>3:g,p-=g,h-=g<<3,o.bitb=_,o.bitk=h,s.avail_in=w,s.total_in+=p-s.next_in_index,s.next_in_index=p,o.write=v,-3;l+=f[U+2],c=f[U=3*(d+(l+=_&u[c]))];}break}if(0!=(64&c))return 0!=(32&c)?(w+=g=h>>3<(g=s.avail_in-w)?h>>3:g,p-=g,h-=g<<3,o.bitb=_,o.bitk=h,s.avail_in=w,s.total_in+=p-s.next_in_index,s.next_in_index=p,o.write=v,1):(s.msg="invalid literal/length code",w+=g=h>>3<(g=s.avail_in-w)?h>>3:g,p-=g,h-=g<<3,o.bitb=_,o.bitk=h,s.avail_in=w,s.total_in+=p-s.next_in_index,s.next_in_index=p,o.write=v,-3);if(l+=f[U+2],0===(c=f[U=3*(d+(l+=_&u[c]))])){_>>=f[U+1],h-=f[U+1],o.window[v++]=f[U+2],b--;break}}else _>>=f[U+1],h-=f[U+1],o.window[v++]=f[U+2],b--;}while(b>=258&&w>=10);return w+=g=h>>3<(g=s.avail_in-w)?h>>3:g,p-=g,h-=g<<3,o.bitb=_,o.bitk=h,s.avail_in=w,s.total_in+=p-s.next_in_index,s.next_in_index=p,o.write=v,0}r.init=function(r,a,o,s,l,f){e=0,c=r,_=a,n=o,h=s,i=l,p=f,t=null;},r.proc=function(r,v,b){var x,m,g,y,k,U,z,E=0,D=0,A=0;for(A=v.next_in_index,y=v.avail_in,E=r.bitb,D=r.bitk,U=(k=r.write)<r.read?r.read-k-1:r.end-k;;)switch(e){case 0:if(U>=258&&y>=10&&(r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,b=w(c,_,n,h,i,p,r,v),A=v.next_in_index,y=v.avail_in,E=r.bitb,D=r.bitk,U=(k=r.write)<r.read?r.read-k-1:r.end-k,0!=b)){e=1==b?7:9;break}s=c,t=n,o=h,e=1;case 1:for(x=s;D<x;){if(0===y)return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);b=0,y--,E|=(255&v.read_byte(A++))<<D,D+=8;}if(E>>>=t[1+(m=3*(o+(E&u[x])))],D-=t[m+1],0===(g=t[m])){l=t[m+2],e=6;break}if(0!=(16&g)){f=15&g,a=t[m+2],e=2;break}if(0==(64&g)){s=g,o=m/3+t[m+2];break}if(0!=(32&g)){e=7;break}return e=9,v.msg="invalid literal/length code",b=-3,r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);case 2:for(x=f;D<x;){if(0===y)return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);b=0,y--,E|=(255&v.read_byte(A++))<<D,D+=8;}a+=E&u[x],E>>=x,D-=x,s=_,t=i,o=p,e=3;case 3:for(x=s;D<x;){if(0===y)return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);b=0,y--,E|=(255&v.read_byte(A++))<<D,D+=8;}if(E>>=t[1+(m=3*(o+(E&u[x])))],D-=t[m+1],0!=(16&(g=t[m]))){f=15&g,d=t[m+2],e=4;break}if(0==(64&g)){s=g,o=m/3+t[m+2];break}return e=9,v.msg="invalid distance code",b=-3,r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);case 4:for(x=f;D<x;){if(0===y)return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);b=0,y--,E|=(255&v.read_byte(A++))<<D,D+=8;}d+=E&u[x],E>>=x,D-=x,e=5;case 5:for(z=k-d;z<0;)z+=r.end;for(;0!==a;){if(0===U&&(k==r.end&&0!==r.read&&(U=(k=0)<r.read?r.read-k-1:r.end-k),0===U&&(r.write=k,b=r.inflate_flush(v,b),U=(k=r.write)<r.read?r.read-k-1:r.end-k,k==r.end&&0!==r.read&&(U=(k=0)<r.read?r.read-k-1:r.end-k),0===U)))return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);r.window[k++]=r.window[z++],U--,z==r.end&&(z=0),a--;}e=0;break;case 6:if(0===U&&(k==r.end&&0!==r.read&&(U=(k=0)<r.read?r.read-k-1:r.end-k),0===U&&(r.write=k,b=r.inflate_flush(v,b),U=(k=r.write)<r.read?r.read-k-1:r.end-k,k==r.end&&0!==r.read&&(U=(k=0)<r.read?r.read-k-1:r.end-k),0===U)))return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);b=0,r.window[k++]=l,U--,e=0;break;case 7:if(D>7&&(D-=8,y++,A--),r.write=k,b=r.inflate_flush(v,b),U=(k=r.write)<r.read?r.read-k-1:r.end-k,r.read!=r.write)return r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);e=8;case 8:return b=1,r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);case 9:return b=-3,r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b);default:return b=-2,r.bitb=E,r.bitk=D,v.avail_in=y,v.total_in+=A-v.next_in_index,v.next_in_index=A,r.write=k,r.inflate_flush(v,b)}},r.free=function(){};}v.inflate_trees_fixed=function(e,t,n,i){return e[0]=9,t[0]=5,n[0]=d,i[0]=c,0};var x=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function m(e,t){var n,i=this,r=0,a=0,o=0,s=0,l=[0],f=[0],d=new b,c=0,_=new Int32Array(4320),h=new v;i.bitk=0,i.bitb=0,i.window=new Uint8Array(t),i.end=t,i.read=0,i.write=0,i.reset=function(e,t){t&&(t[0]=0),6==r&&d.free(e),r=0,i.bitk=0,i.bitb=0,i.read=i.write=0;},i.reset(e,null),i.inflate_flush=function(e,t){var n,r,a;return r=e.next_out_index,(n=((a=i.read)<=i.write?i.write:i.end)-a)>e.avail_out&&(n=e.avail_out),0!==n&&-5==t&&(t=0),e.avail_out-=n,e.total_out+=n,e.next_out.set(i.window.subarray(a,a+n),r),r+=n,(a+=n)==i.end&&(a=0,i.write==i.end&&(i.write=0),(n=i.write-a)>e.avail_out&&(n=e.avail_out),0!==n&&-5==t&&(t=0),e.avail_out-=n,e.total_out+=n,e.next_out.set(i.window.subarray(a,a+n),r),r+=n,a+=n),e.next_out_index=r,i.read=a,t},i.proc=function(e,t){var p,w,b,m,g,y,k,U;for(m=e.next_in_index,g=e.avail_in,w=i.bitb,b=i.bitk,k=(y=i.write)<i.read?i.read-y-1:i.end-y;;)switch(r){case 0:for(;b<3;){if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);t=0,g--,w|=(255&e.read_byte(m++))<<b,b+=8;}switch(c=1&(p=7&w),p>>>1){case 0:w>>>=3,w>>>=p=7&(b-=3),b-=p,r=1;break;case 1:var z=[],E=[],D=[[]],A=[[]];v.inflate_trees_fixed(z,E,D,A),d.init(z[0],E[0],D[0],0,A[0],0),w>>>=3,b-=3,r=6;break;case 2:w>>>=3,b-=3,r=3;break;case 3:return w>>>=3,b-=3,r=9,e.msg="invalid block type",t=-3,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t)}break;case 1:for(;b<32;){if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);t=0,g--,w|=(255&e.read_byte(m++))<<b,b+=8;}if((~w>>>16&65535)!=(65535&w))return r=9,e.msg="invalid stored block lengths",t=-3,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);a=65535&w,w=b=0,r=0!==a?2:0!==c?7:0;break;case 2:if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);if(0===k&&(y==i.end&&0!==i.read&&(k=(y=0)<i.read?i.read-y-1:i.end-y),0===k&&(i.write=y,t=i.inflate_flush(e,t),k=(y=i.write)<i.read?i.read-y-1:i.end-y,y==i.end&&0!==i.read&&(k=(y=0)<i.read?i.read-y-1:i.end-y),0===k)))return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);if(t=0,(p=a)>g&&(p=g),p>k&&(p=k),i.window.set(e.read_buf(m,p),y),m+=p,g-=p,y+=p,k-=p,0!=(a-=p))break;r=0!==c?7:0;break;case 3:for(;b<14;){if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);t=0,g--,w|=(255&e.read_byte(m++))<<b,b+=8;}if(o=p=16383&w,(31&p)>29||(p>>5&31)>29)return r=9,e.msg="too many length or distance symbols",t=-3,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);if(p=258+(31&p)+(p>>5&31),!n||n.length<p)n=[];else for(U=0;U<p;U++)n[U]=0;w>>>=14,b-=14,s=0,r=4;case 4:for(;s<4+(o>>>10);){for(;b<3;){if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);t=0,g--,w|=(255&e.read_byte(m++))<<b,b+=8;}n[x[s++]]=7&w,w>>>=3,b-=3;}for(;s<19;)n[x[s++]]=0;if(l[0]=7,0!=(p=h.inflate_trees_bits(n,l,f,_,e)))return -3==(t=p)&&(n=null,r=9),i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);s=0,r=5;case 5:for(;!(s>=258+(31&(p=o))+(p>>5&31));){var S,R;for(p=l[0];b<p;){if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);t=0,g--,w|=(255&e.read_byte(m++))<<b,b+=8;}if((R=_[3*(f[0]+(w&u[p=_[3*(f[0]+(w&u[p]))+1]]))+2])<16)w>>>=p,b-=p,n[s++]=R;else {for(U=18==R?7:R-14,S=18==R?11:3;b<p+U;){if(0===g)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);t=0,g--,w|=(255&e.read_byte(m++))<<b,b+=8;}if(b-=p,S+=(w>>>=p)&u[U],w>>>=U,b-=U,(U=s)+S>258+(31&(p=o))+(p>>5&31)||16==R&&U<1)return n=null,r=9,e.msg="invalid bit length repeat",t=-3,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);R=16==R?n[U-1]:0;do{n[U++]=R;}while(0!=--S);s=U;}}f[0]=-1;var F=[],T=[],W=[],M=[];if(F[0]=9,T[0]=6,0!=(p=h.inflate_trees_dynamic(257+(31&(p=o)),1+(p>>5&31),n,F,T,W,M,_,e)))return -3==p&&(n=null,r=9),t=p,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);d.init(F[0],T[0],_,W[0],_,M[0]),r=6;case 6:if(i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,1!=(t=d.proc(i,e,t)))return i.inflate_flush(e,t);if(t=0,d.free(e),m=e.next_in_index,g=e.avail_in,w=i.bitb,b=i.bitk,k=(y=i.write)<i.read?i.read-y-1:i.end-y,0===c){r=0;break}r=7;case 7:if(i.write=y,t=i.inflate_flush(e,t),k=(y=i.write)<i.read?i.read-y-1:i.end-y,i.read!=i.write)return i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);r=8;case 8:return t=1,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);case 9:return t=-3,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t);default:return t=-2,i.bitb=w,i.bitk=b,e.avail_in=g,e.total_in+=m-e.next_in_index,e.next_in_index=m,i.write=y,i.inflate_flush(e,t)}},i.free=function(e){i.reset(e,null),i.window=null,_=null;},i.set_dictionary=function(e,t,n){i.window.set(e.subarray(t,t+n),0),i.read=i.write=n;},i.sync_point=function(){return 1==r?1:0};}var g=[0,0,255,255];function y(){var e=this;function t(e){return e&&e.istate?(e.total_in=e.total_out=0,e.msg=null,e.istate.mode=7,e.istate.blocks.reset(e,null),0):-2}e.mode=0,e.method=0,e.was=[0],e.need=0,e.marker=0,e.wbits=0,e.inflateEnd=function(t){return e.blocks&&e.blocks.free(t),e.blocks=null,0},e.inflateInit=function(n,i){return n.msg=null,e.blocks=null,i<8||i>15?(e.inflateEnd(n),-2):(e.wbits=i,n.istate.blocks=new m(n,1<<i),t(n),0)},e.inflate=function(e,t){var n,i;if(!e||!e.istate||!e.next_in)return -2;for(t=4==t?-5:0,n=-5;;)switch(e.istate.mode){case 0:if(0===e.avail_in)return n;if(n=t,e.avail_in--,e.total_in++,8!=(15&(e.istate.method=e.read_byte(e.next_in_index++)))){e.istate.mode=13,e.msg="unknown compression method",e.istate.marker=5;break}if(8+(e.istate.method>>4)>e.istate.wbits){e.istate.mode=13,e.msg="invalid window size",e.istate.marker=5;break}e.istate.mode=1;case 1:if(0===e.avail_in)return n;if(n=t,e.avail_in--,e.total_in++,i=255&e.read_byte(e.next_in_index++),((e.istate.method<<8)+i)%31!=0){e.istate.mode=13,e.msg="incorrect header check",e.istate.marker=5;break}if(0==(32&i)){e.istate.mode=7;break}e.istate.mode=2;case 2:if(0===e.avail_in)return n;n=t,e.avail_in--,e.total_in++,e.istate.need=(255&e.read_byte(e.next_in_index++))<<24&4278190080,e.istate.mode=3;case 3:if(0===e.avail_in)return n;n=t,e.avail_in--,e.total_in++,e.istate.need+=(255&e.read_byte(e.next_in_index++))<<16&16711680,e.istate.mode=4;case 4:if(0===e.avail_in)return n;n=t,e.avail_in--,e.total_in++,e.istate.need+=(255&e.read_byte(e.next_in_index++))<<8&65280,e.istate.mode=5;case 5:return 0===e.avail_in?n:(n=t,e.avail_in--,e.total_in++,e.istate.need+=255&e.read_byte(e.next_in_index++),e.istate.mode=6,2);case 6:return e.istate.mode=13,e.msg="need dictionary",e.istate.marker=0,-2;case 7:if(-3==(n=e.istate.blocks.proc(e,n))){e.istate.mode=13,e.istate.marker=0;break}if(0==n&&(n=t),1!=n)return n;n=t,e.istate.blocks.reset(e,e.istate.was),e.istate.mode=12;case 12:return 1;case 13:return -3;default:return -2}},e.inflateSetDictionary=function(e,t,n){var i=0,r=n;return e&&e.istate&&6==e.istate.mode?(r>=1<<e.istate.wbits&&(i=n-(r=(1<<e.istate.wbits)-1)),e.istate.blocks.set_dictionary(t,i,r),e.istate.mode=7,0):-2},e.inflateSync=function(e){var n,i,r,a,o;if(!e||!e.istate)return -2;if(13!=e.istate.mode&&(e.istate.mode=13,e.istate.marker=0),0===(n=e.avail_in))return -5;for(i=e.next_in_index,r=e.istate.marker;0!==n&&r<4;)e.read_byte(i)==g[r]?r++:r=0!==e.read_byte(i)?0:4-r,i++,n--;return e.total_in+=i-e.next_in_index,e.next_in_index=i,e.avail_in=n,e.istate.marker=r,4!=r?-3:(a=e.total_in,o=e.total_out,t(e),e.total_in=a,e.total_out=o,e.istate.mode=7,0)},e.inflateSyncPoint=function(e){return e&&e.istate&&e.istate.blocks?e.istate.blocks.sync_point():-2};}function k(){}function U(){var e=new k,t=new Uint8Array(512),n=!1;e.inflateInit(),e.next_out=t,this.append=function(i,r){var a,o,s=[],l=0,f=0,u=0;if(0!==i.length){e.next_in_index=0,e.next_in=i,e.avail_in=i.length;do{if(e.next_out_index=0,e.avail_out=512,0!==e.avail_in||n||(e.next_in_index=0,n=!0),a=e.inflate(0),n&&-5===a){if(0!==e.avail_in)throw new Error("inflating: bad input")}else if(0!==a&&1!==a)throw new Error("inflating: "+e.msg);if((n||1===a)&&e.avail_in===i.length)throw new Error("inflating: bad input");e.next_out_index&&s.push(512===e.next_out_index?new Uint8Array(t):new Uint8Array(t.subarray(0,e.next_out_index))),u+=e.next_out_index,r&&e.next_in_index>0&&e.next_in_index!=l&&(r(e.next_in_index),l=e.next_in_index);}while(e.avail_in>0||0===e.avail_out);return o=new Uint8Array(u),s.forEach(function(e){o.set(e,f),f+=e.length;}),o}},this.flush=function(){e.inflateEnd();};}k.prototype={inflateInit:function(e){var t=this;return t.istate=new y,e||(e=15),t.istate.inflateInit(t,e)},inflate:function(e){var t=this;return t.istate?t.istate.inflate(t,e):-2},inflateEnd:function(){var e=this;if(!e.istate)return -2;var t=e.istate.inflateEnd(e);return e.istate=null,t},inflateSync:function(){var e=this;return e.istate?e.istate.inflateSync(e):-2},inflateSetDictionary:function(e,t){var n=this;return n.istate?n.istate.inflateSetDictionary(n,e,t):-2},read_byte:function(e){return this.next_in.subarray(e,e+1)[0]},read_buf:function(e,t){return this.next_in.subarray(e,e+t)}},self._zipjs_Inflater=U;var z,E="File format is not recognized.",D="Error while reading zip file.";try{z=0===new Blob([new DataView(new ArrayBuffer(0))]).size;}catch(e){}function A(){this.crc=-1;}function S(){}function R(e,t){var n,i;return n=new ArrayBuffer(e),i=new Uint8Array(n),t&&i.set(t,0),{buffer:n,array:i,view:new DataView(n)}}function F(){}function T(e){var t,n=this;n.size=0,n.init=function(i,r){var a=new Blob([e],{type:"text/plain"});(t=new M(a)).init(function(){n.size=t.size,i();},r);},n.readUint8Array=function(e,n,i,r){t.readUint8Array(e,n,i,r);};}function W(e){var t,n=this;n.size=0,n.init=function(i){for(var r=e.length;"="==e.charAt(r-1);)r--;t=e.indexOf(",")+1,n.size=Math.floor(.75*(r-t)),i();},n.readUint8Array=function(n,i,r){var a,o=R(i),s=4*Math.floor(n/3),l=4*Math.ceil((n+i)/3),f=self.atob(e.substring(s+t,l+t)),u=n-3*Math.floor(s/4);for(a=u;a<u+i;a++)o.array[a-u]=f.charCodeAt(a);r(o.array);};}function M(e){var t=this;t.size=0,t.init=function(n){t.size=e.size,n();},t.readUint8Array=function(t,n,i,r){var a=new FileReader;a.onload=function(e){i(new Uint8Array(e.target.result));},a.onerror=r;try{a.readAsArrayBuffer(function(e,t,n){if(t<0||n<0||t+n>e.size)throw new RangeError("offset:"+t+", length:"+n+", size:"+e.size);return e.slice?e.slice(t,t+n):e.webkitSlice?e.webkitSlice(t,t+n):e.mozSlice?e.mozSlice(t,t+n):e.msSlice?e.msSlice(t,t+n):void 0}(e,t,n));}catch(e){r(e);}};}function B(){}function I(e){var t,n=this;n.init=function(e){t=new Blob([],{type:"text/plain"}),e();},n.writeUint8Array=function(e,n){t=new Blob([t,z?e:e.buffer],{type:"text/plain"}),n();},n.getData=function(n,i){var r=new FileReader;r.onload=function(e){n(e.target.result);},r.onerror=i,r.readAsText(t,e);};}function C(e){var t=this,n="",i="";t.init=function(t){n+="data:"+(e||"")+";base64,",t();},t.writeUint8Array=function(e,t){var r,a=i.length,o=i;for(i="",r=0;r<3*Math.floor((a+e.length)/3)-a;r++)o+=String.fromCharCode(e[r]);for(;r<e.length;r++)i+=String.fromCharCode(e[r]);o.length>2?n+=self.btoa(o):i=o,t();},t.getData=function(e){e(n+self.btoa(i));};}function L(e){var t,n=this;n.init=function(n){t=new Blob([],{type:e}),n();},n.writeUint8Array=function(n,i){t=new Blob([t,z?n:n.buffer],{type:e}),i();},n.getData=function(e){e(t);};}function P(e,t,n,i,r,a,o,s,l,f){var u,d,c,_=0,h=t.sn;function p(){e.removeEventListener("message",w,!1),s(d,c);}function w(t){var n=t.data,r=n.data,s=n.error;if(s)return s.toString=function(){return "Error: "+this.message},void l(s);if(n.sn===h)switch("number"==typeof n.codecTime&&(e.codecTime+=n.codecTime),"number"==typeof n.crcTime&&(e.crcTime+=n.crcTime),n.type){case"append":r?(d+=r.length,i.writeUint8Array(r,function(){v();},f)):v();break;case"flush":c=n.crc,r?(d+=r.length,i.writeUint8Array(r,function(){p();},f)):p();break;case"progress":o&&o(u+n.loaded,a);break;case"importScripts":case"newTask":case"echo":break;default:console.warn("zip.js:launchWorkerProcess: unknown message: ",n);}}function v(){(u=524288*_)<=a?n.readUint8Array(r+u,Math.min(524288,a-u),function(n){o&&o(u,a);var i=0===u?t:{sn:h};i.type="append",i.data=n;try{e.postMessage(i,[n.buffer]);}catch(t){e.postMessage(i);}_++;},l):e.postMessage({sn:h,type:"flush"});}d=0,e.addEventListener("message",w,!1),v();}function Z(e,t,n,i,r,a,o,s,l,f){var u,d=0,c=0,_="input"===a,h="output"===a,p=new A;!function a(){var w;if((u=524288*d)<r)t.readUint8Array(i+u,Math.min(524288,r-u),function(t){var i;try{i=e.append(t,function(e){o&&o(u+e,r);});}catch(e){return void l(e)}i?(c+=i.length,n.writeUint8Array(i,function(){d++,setTimeout(a,1);},f),h&&p.append(i)):(d++,setTimeout(a,1)),_&&p.append(t),o&&o(u,r);},l);else {try{w=e.flush();}catch(e){return void l(e)}w?(h&&p.append(w),c+=w.length,n.writeUint8Array(w,function(){s(c,p.get());},f)):s(c,p.get());}}();}function N(e,t,n,i,r,a,o,s,l,f,u){var d="input";K.useWebWorkers&&o?P(e,{sn:t,codecClass:"_zipjs_NOOP",crcType:d},n,i,r,a,l,s,f,u):Z(new S,n,i,r,a,d,l,s,f,u);}function j(e){var t,n,i="",r=["Ç","ü","é","â","ä","à","å","ç","ê","ë","è","ï","î","ì","Ä","Å","É","æ","Æ","ô","ö","ò","û","ù","ÿ","Ö","Ü","ø","£","Ø","×","ƒ","á","í","ó","ú","ñ","Ñ","ª","º","¿","®","¬","½","¼","¡","«","»","_","_","_","¦","¦","Á","Â","À","©","¦","¦","+","+","¢","¥","+","+","-","-","+","-","+","ã","Ã","+","+","-","-","¦","-","+","¤","ð","Ð","Ê","Ë","È","i","Í","Î","Ï","+","+","_","_","¦","Ì","_","Ó","ß","Ô","Ò","õ","Õ","µ","þ","Þ","Ú","Û","Ù","ý","Ý","¯","´","­","±","_","¾","¶","§","÷","¸","°","¨","·","¹","³","²","_"," "];for(t=0;t<e.length;t++)i+=(n=255&e.charCodeAt(t))>127?r[n-128]:String.fromCharCode(n);return i}function O(e){return decodeURIComponent(escape(e))}function V(e){var t,n="";for(t=0;t<e.length;t++)n+=String.fromCharCode(e[t]);return n}function q(e,t,n,i,r){e.version=t.view.getUint16(n,!0),e.bitFlag=t.view.getUint16(n+2,!0),e.compressionMethod=t.view.getUint16(n+4,!0),e.lastModDateRaw=t.view.getUint32(n+6,!0),e.lastModDate=function(e){var t=(4294901760&e)>>16,n=65535&e;try{return new Date(1980+((65024&t)>>9),((480&t)>>5)-1,31&t,(63488&n)>>11,(2016&n)>>5,2*(31&n),0)}catch(e){}}(e.lastModDateRaw),1!=(1&e.bitFlag)?((i||8!=(8&e.bitFlag))&&(e.crc32=t.view.getUint32(n+10,!0),e.compressedSize=t.view.getUint32(n+14,!0),e.uncompressedSize=t.view.getUint32(n+18,!0)),4294967295!==e.compressedSize&&4294967295!==e.uncompressedSize?(e.filenameLength=t.view.getUint16(n+22,!0),e.extraFieldLength=t.view.getUint16(n+24,!0)):r("File is using Zip64 (4gb+ file size).")):r("File contains encrypted entry.");}function $(e){return unescape(encodeURIComponent(e))}function G(e){var t,n=[];for(t=0;t<e.length;t++)n.push(e.charCodeAt(t));return n}A.prototype.append=function(e){for(var t=0|this.crc,n=this.table,i=0,r=0|e.length;i<r;i++)t=t>>>8^n[255&(t^e[i])];this.crc=t;},A.prototype.get=function(){return ~this.crc},A.prototype.table=function(){var e,t,n,i=[];for(e=0;e<256;e++){for(n=e,t=0;t<8;t++)1&n?n=n>>>1^3988292384:n>>>=1;i[e]=n;}return i}(),S.prototype.append=function(e,t){return e},S.prototype.flush=function(){},(T.prototype=new F).constructor=T,(W.prototype=new F).constructor=W,(M.prototype=new F).constructor=M,B.prototype.getData=function(e){e(this.data);},(I.prototype=new B).constructor=I,(C.prototype=new B).constructor=C,(L.prototype=new B).constructor=L;var H={deflater:["z-worker.js","deflate.js"],inflater:["z-worker.js","inflate.js"]};function Y(e,t,n){if(null===K.workerScripts||null===K.workerScriptsPath){var i,r,a;if(K.workerScripts){if(i=K.workerScripts[e],!Array.isArray(i))return void n(new Error("zip.workerScripts."+e+" is not an array!"));r=i,a=document.createElement("a"),i=r.map(function(e){return a.href=e,a.href});}else (i=H[e].slice(0))[0]=(K.workerScriptsPath||"")+i[0];var o=new Worker(i[0]);o.codecTime=o.crcTime=0,o.postMessage({type:"importScripts",scripts:i.slice(1)}),o.addEventListener("message",function e(i){var r=i.data;if(r.error)return o.terminate(),void n(r.error);"importScripts"===r.type&&(o.removeEventListener("message",e),o.removeEventListener("error",s),t(o));}),o.addEventListener("error",s);}else n(new Error("Either zip.workerScripts or zip.workerScriptsPath may be set, not both."));function s(e){o.terminate(),n(e);}}function J(e){console.error(e);}const K={Reader:F,Writer:B,BlobReader:M,Data64URIReader:W,TextReader:T,BlobWriter:L,Data64URIWriter:C,TextWriter:I,createReader:function(e,t,n){e.init(function(){!function(e,t,n){var i=0;function r(){}r.prototype.getData=function(t,r,a,o){var s=this;function l(e,i){o&&!function(e){var t=R(4);return t.view.setUint32(0,e),s.crc32==t.view.getUint32(0)}(i)?n("CRC failed."):t.getData(function(e){r(e);});}function f(e){n(e||"Error while reading file data.");}function u(e){n(e||"Error while writing file data.");}e.readUint8Array(s.offset,30,function(r){var d,c=R(r.length,r);1347093252==c.view.getUint32(0)?(q(s,c,4,!1,n),d=s.offset+30+s.filenameLength+s.extraFieldLength,t.init(function(){0===s.compressionMethod?N(s._worker,i++,e,t,d,s.compressedSize,o,l,a,f,u):function(e,t,n,i,r,a,o,s,l,f,u){var d=o?"output":"none";K.useWebWorkers?P(e,{sn:t,codecClass:"_zipjs_Inflater",crcType:d},n,i,r,a,l,s,f,u):Z(new U,n,i,r,a,d,l,s,f,u);}(s._worker,i++,e,t,d,s.compressedSize,o,l,a,f,u);},u)):n(E);},f);};var a={getEntries:function(t){var i=this._worker;!function(t){function i(i,r){e.readUint8Array(e.size-i,i,function(e){for(var n=e.length-22;n>=0;n--)if(80===e[n]&&75===e[n+1]&&5===e[n+2]&&6===e[n+3])return void t(new DataView(e.buffer,n,22));r();},function(){n(D);});}e.size<22?n(E):i(22,function(){i(Math.min(65558,e.size),function(){n(E);});});}(function(a){var o,s;o=a.getUint32(16,!0),s=a.getUint16(8,!0),o<0||o>=e.size?n(E):e.readUint8Array(o,e.size-o,function(e){var a,o,l,f,u=0,d=[],c=R(e.length,e);for(a=0;a<s;a++){if((o=new r)._worker=i,1347092738!=c.view.getUint32(u))return void n(E);q(o,c,u+6,!0,n),o.commentLength=c.view.getUint16(u+32,!0),o.directory=16==(16&c.view.getUint8(u+38)),o.offset=c.view.getUint32(u+42,!0),l=V(c.array.subarray(u+46,u+46+o.filenameLength)),o.filename=2048==(2048&o.bitFlag)?O(l):j(l),o.directory||"/"!=o.filename.charAt(o.filename.length-1)||(o.directory=!0),f=V(c.array.subarray(u+46+o.filenameLength+o.extraFieldLength,u+46+o.filenameLength+o.extraFieldLength+o.commentLength)),o.comment=2048==(2048&o.bitFlag)?O(f):j(f),d.push(o),u+=46+o.filenameLength+o.extraFieldLength+o.commentLength;}t(d);},function(){n(D);});});},close:function(e){this._worker&&(this._worker.terminate(),this._worker=null),e&&e();},_worker:null};K.useWebWorkers?Y("inflater",function(e){a._worker=e,t(a);},function(e){n(e);}):t(a);}(e,t,n);},n=n||J);},createWriter:function(e,t,n,i){i=!!i,e.init(function(){!function(e,t,n,i){var r={},a=[],o=0,s=0;function l(e){n(e||"Error while writing zip file.");}function u(e){n(e||"Error while reading file data.");}var d={add:function(t,d,c,_,h){var p,w,v,b=this._worker;function x(t,n){var i=R(16);o+=t||0,i.view.setUint32(0,1347094280),void 0!==n&&(p.view.setUint32(10,n,!0),i.view.setUint32(4,n,!0)),d&&(i.view.setUint32(8,t,!0),p.view.setUint32(14,t,!0),i.view.setUint32(12,d.size,!0),p.view.setUint32(18,d.size,!0)),e.writeUint8Array(i.array,function(){o+=16,c();},l);}function m(){var c;h=h||{},t=t.trim(),h.directory&&"/"!=t.charAt(t.length-1)&&(t+="/"),r.hasOwnProperty(t)?n("File already exists."):(w=G($(t)),a.push(t),v=h.lastModDate||new Date,p=R(26),r[t]={headerArray:p.array,directory:h.directory,filename:w,offset:o,comment:G($(h.comment||""))},p.view.setUint32(0,335546376),h.version&&p.view.setUint8(0,h.version),i||0===h.level||h.directory||p.view.setUint16(4,2048),p.view.setUint16(6,(v.getHours()<<6|v.getMinutes())<<5|v.getSeconds()/2,!0),p.view.setUint16(8,(v.getFullYear()-1980<<4|v.getMonth()+1)<<5|v.getDate(),!0),p.view.setUint16(22,w.length,!0),(c=R(30+w.length)).view.setUint32(0,1347093252),c.array.set(p.array,4),c.array.set(w,30),o+=c.array.length,e.writeUint8Array(c.array,function(){d?i||0===h.level?N(b,s++,d,e,0,d.size,!0,x,_,u,l):function(e,t,n,i,r,a,o,s,l){var u="input";K.useWebWorkers?P(e,{sn:t,options:{level:r},codecClass:"_zipjs_Deflater",crcType:u},n,i,0,n.size,o,a,s,l):Z(new f,n,i,0,n.size,u,o,a,s,l);}(b,s++,d,e,h.level,x,_,u,l):x();},l));}d?d.init(m,u):m();},close:function(t){this._worker&&(this._worker.terminate(),this._worker=null);var n,i,s,f=0,u=0;for(i=0;i<a.length;i++)f+=46+(s=r[a[i]]).filename.length+s.comment.length;for(n=R(f+22),i=0;i<a.length;i++)s=r[a[i]],n.view.setUint32(u,1347092738),n.view.setUint16(u+4,5120),n.array.set(s.headerArray,u+6),n.view.setUint16(u+32,s.comment.length,!0),s.directory&&n.view.setUint8(u+38,16),n.view.setUint32(u+42,s.offset,!0),n.array.set(s.filename,u+46),n.array.set(s.comment,u+46+s.filename.length),u+=46+s.filename.length+s.comment.length;n.view.setUint32(u,1347093766),n.view.setUint16(u+8,a.length,!0),n.view.setUint16(u+10,a.length,!0),n.view.setUint32(u+12,f,!0),n.view.setUint32(u+16,o,!0),e.writeUint8Array(n.array,function(){e.getData(t);},l);},_worker:null};K.useWebWorkers?Y("deflater",function(e){d._worker=e,t(d);},function(e){n(e);}):t(d);}(e,t,n,i);},n=n||J);},useWebWorkers:!0,workerScriptsPath:null,workerScripts:null};var Q,X,ee=K.TextWriter,te=K.BlobWriter,ne=K.Data64URIWriter,ie=K.TextReader,re=K.BlobReader,ae=K.Data64URIReader,oe=K.createReader,se=K.createWriter;function le(e){var t,n=this;n.size=0,n.init=function(t){n.size=e.uncompressedSize,t();},n.readUint8Array=function(i,r,a,o){!function(i){n.data?i():e.getData(new te,function(e){n.data=e,t=new re(e),i();},null,n.checkCrc32);}(function(){t.readUint8Array(i,r,a,o);});};}function fe(e){var t=0;return function e(n){t+=n.uncompressedSize||0,n.children.forEach(e);}(e),t}function ue(e,t,n){var i=0;function r(){++i<e.children.length?a(e.children[i]):t();}function a(e){e.directory?ue(e,r,n):(e.reader=new e.Reader(e.data,n),e.reader.init(function(){e.uncompressedSize=e.reader.size,r();}));}e.children.length?a(e.children[i]):t();}function de(e){var t=e.parent.children;t.forEach(function(n,i){n.id==e.id&&t.splice(i,1);});}function ce(e){e.entries=[],e.root=new we(e);}function _e(e,t,n,i){if(e.directory)return i?new we(e.fs,t,n,e):new pe(e.fs,t,n,e);throw "Parent entry is not a directory."}function he(){}function pe(e,t,n,i){var r=this;he.prototype.init.call(r,e,t,n,i),r.Reader=n.Reader,r.Writer=n.Writer,r.data=n.data,n.getData&&(r.getData=n.getData);}function we(e,t,n,i){he.prototype.init.call(this,e,t,n,i),this.directory=!0;}function ve(){ce(this);}(le.prototype=new(K.Reader)).constructor=le,le.prototype.checkCrc32=!1,(he.prototype={init:function(e,t,n,i){var r=this;if(e.root&&i&&i.getChildByName(t))throw "Entry filename already exists.";n||(n={}),r.fs=e,r.name=t,r.id=e.entries.length,r.parent=i,r.children=[],r.zipVersion=n.zipVersion||20,r.uncompressedSize=0,e.entries.push(r),i&&r.parent.children.push(r);},getFileEntry:function(e,t,n,i,r){var a=this;ue(a,function(){!function(e,t,n,i,r,a,o){var s=0;t.directory?function e(t,n,i,r,a,l){var f=0;!function u(){var d=n.children[f];d?function(n){function i(t){s+=n.uncompressedSize||0,e(t,n,function(){f++,u();},r,a,l);}n.directory?t.getDirectory(n.name,{create:!0},i,a):t.getFile(n.name,{create:!0},function(e){n.getData(new K.FileWriter(e,K.getMimeType(n.name)),i,function(e){r&&r(s+e,l);},o);},a);}(d):i();}();}(e,t,n,i,r,a):t.getData(new K.FileWriter(e,K.getMimeType(t.name)),n,i,o);}(e,a,t,n,i,fe(a),r);},i);},moveTo:function(e){var t=this;if(!e.directory)throw "Target entry is not a directory.";if(e.isDescendantOf(t))throw "Entry is a ancestor of target entry.";if(t!=e){if(e.getChildByName(t.name))throw "Entry filename already exists.";de(t),t.parent=e,e.children.push(t);}},getFullname:function(){for(var e=this.name,t=this.parent;t;)e=(t.name?t.name+"/":"")+e,t=t.parent;return e},isDescendantOf:function(e){for(var t=this.parent;t&&t.id!=e.id;)t=t.parent;return !!t}}).constructor=he,pe.prototype=Q=new he,Q.constructor=pe,Q.getData=function(e,t,n,i){var r=this;!e||e.constructor==r.Writer&&r.data?t(r.data):(r.reader||(r.reader=new r.Reader(r.data,i)),r.reader.init(function(){e.init(function(){!function(e,t,n,i,r){var a=0;!function o(){var s=524288*a;i&&i(s,e.size),s<e.size?e.readUint8Array(s,Math.min(524288,e.size-s),function(e){t.writeUint8Array(new Uint8Array(e),function(){a++,o();});},r):t.getData(n);}();}(r.reader,e,t,n,i);},i);}));},Q.getText=function(e,t,n,i){this.getData(new ee(i),e,t,n);},Q.getBlob=function(e,t,n,i){this.getData(new te(e),t,n,i);},Q.getData64URI=function(e,t,n,i){this.getData(new ne(e),t,n,i);},we.prototype=X=new he,X.constructor=we,X.addDirectory=function(e){return _e(this,e,null,!0)},X.addText=function(e,t){return _e(this,e,{data:t,Reader:ie,Writer:ee})},X.addBlob=function(e,t){return _e(this,e,{data:t,Reader:re,Writer:te})},X.addData64URI=function(e,t){return _e(this,e,{data:t,Reader:ae,Writer:ne})},X.addFileEntry=function(e,t,n){!function(e,t,n,i){t.isDirectory?function e(t,n,r){!function(e,t){e.isDirectory&&e.createReader().readEntries(t),e.isFile&&t([]);}(n,function(n){var a=0;!function o(){var s=n[a];s?function(n){function r(t){e(t,n,function(){a++,o();});}n.isDirectory&&r(t.addDirectory(n.name)),n.isFile&&n.file(function(e){var i=t.addBlob(n.name,e);i.uncompressedSize=e.size,r(i);},i);}(s):r();}();});}(e,t,n):t.file(function(i){e.addBlob(t.name,i),n();},i);}(this,e,t,n);},X.addData=function(e,t){return _e(this,e,t)},X.importBlob=function(e,t,n){this.importZip(new re(e),t,n);},X.importText=function(e,t,n){this.importZip(new ie(e),t,n);},X.importData64URI=function(e,t,n){this.importZip(new ae(e),t,n);},X.exportBlob=function(e,t,n){this.exportZip(new te("application/zip"),e,t,n);},X.exportText=function(e,t,n){this.exportZip(new ee,e,t,n);},X.exportFileEntry=function(e,t,n,i){this.exportZip(new K.FileWriter(e,"application/zip"),t,n,i);},X.exportData64URI=function(e,t,n){this.exportZip(new ne("application/zip"),e,t,n);},X.importZip=function(e,t,n){var i=this;oe(e,function(e){e.getEntries(function(e){e.forEach(function(e){var t=i,n=e.filename.split("/"),r=n.pop();n.forEach(function(e){t=t.getChildByName(e)||new we(i.fs,e,null,t);}),e.directory||_e(t,r,{data:e,Reader:le});}),t();});},n);},X.exportZip=function(e,t,n,i){var r=this;ue(r,function(){se(e,function(e){!function(e,t,n,i,r){var a=0;!function e(t,n,i,r,o){var s=0;!function l(){var f=n.children[s];f?t.add(f.getFullname(),f.reader,function(){a+=f.uncompressedSize||0,e(t,f,function(){s++,l();},r,o);},function(e){r&&r(a+e,o);},{directory:f.directory,version:f.zipVersion}):i();}();}(e,t,n,i,r);}(e,r,function(){e.close(t);},n,fe(r));},i);},i);},X.getChildByName=function(e){var t,n;for(t=0;t<this.children.length;t++)if((n=this.children[t]).name==e)return n},ve.prototype={remove:function(e){de(e),this.entries[e.id]=null;},find:function(e){var t,n=e.split("/"),i=this.root;for(t=0;i&&t<n.length;t++)i=i.getChildByName(n[t]);return i},getById:function(e){return this.entries[e]},importBlob:function(e,t,n){ce(this),this.root.importBlob(e,t,n);},importText:function(e,t,n){ce(this),this.root.importText(e,t,n);},importData64URI:function(e,t,n){ce(this),this.root.importData64URI(e,t,n);},exportBlob:function(e,t,n){this.root.exportBlob(e,t,n);},exportText:function(e,t,n){this.root.exportText(e,t,n);},exportFileEntry:function(e,t,n,i){this.root.exportFileEntry(e,t,n,i);},exportData64URI:function(e,t,n){this.root.exportData64URI(e,t,n);}},K.getMimeType=function(){return "application/octet-stream"};var be={FS:ve,ZipDirectoryEntry:we,ZipFileEntry:pe};K.useWebWorkers=!1;var xe=function(){function e(e,t){this.el=e,this.inputEl=t,this.listeners={drop:[],dropstart:[],droperror:[]},this._onDragover=this._onDragover.bind(this),this._onDrop=this._onDrop.bind(this),this._onSelect=this._onSelect.bind(this),e.addEventListener("dragover",this._onDragover,!1),e.addEventListener("drop",this._onDrop,!1),t.addEventListener("change",this._onSelect);}var t=e.prototype;return t.on=function(e,t){return this.listeners[e].push(t),this},t._emit=function(e,t){return this.listeners[e].forEach(function(e){return e(t)}),this},t.destroy=function(){var e=this.el,t=this.inputEl;e.removeEventListener(this._onDragover),e.removeEventListener(this._onDrop),t.removeEventListener(this._onSelect),delete this.el,delete this.inputEl,delete this.listeners;},t._onDrop=function(e){e.stopPropagation(),e.preventDefault(),this._emit("dropstart");var t=Array.from(e.dataTransfer.files||[]),n=Array.from(e.dataTransfer.items||[]);if(0!==t.length||0!==n.length)if(n.length>0){var i=n.map(function(e){return e.webkitGetAsEntry()});i[0].name.match(/\.zip$/)?this._loadZip(n[0].getAsFile()):this._loadNextEntry(new Map,i);}else 1===t.length&&t[0].name.match(/\.zip$/)&&this._loadZip(t[0]),this._emit("drop",{files:new Map(t.map(function(e){return [e.name,e]}))});else this._fail("Required drag-and-drop APIs are not supported in this browser.");},t._onDragover=function(e){e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy";},t._onSelect=function(e){this._emit("dropstart");var t=[].slice.call(this.inputEl.files);if(1===t.length&&this._isZip(t[0]))this._loadZip(t[0]);else {var n=new Map;t.forEach(function(e){return n.set(e.name,e)}),this._emit("drop",{files:n});}},t._loadNextEntry=function(e,t){var n=this,i=t.pop();if(i)if(i.isFile)i.file(function(r){e.set(i.fullPath,r),n._loadNextEntry(e,t);},function(){return console.error("Could not load file: %s",i.fullPath)});else if(i.isDirectory){var r=i.createReader();r.readEntries(function i(a){a.length?(t=t.concat(a),r.readEntries(i)):n._loadNextEntry(e,t);});}else console.warn("Unknown asset type: "+i.fullPath),this._loadNextEntry(e,t);else this._emit("drop",{files:e});},t._loadZip=function(e){var t=this,n=[],i=new Map,r=new be.FS,a=function e(t){t.directory?t.children.forEach(e):"."!==t.name[0]&&n.push(new Promise(function(e){t.getData(new K.BlobWriter,function(n){n.name=t.name,i.set(t.getFullname(),n),e();});}));};r.importBlob(e,function(){a(r.root),Promise.all(n).then(function(){t._emit("drop",{files:i,archive:e});});});},t._isZip=function(e){return "application/zip"===e.type||e.name.match(/\.zip$/)},t._fail=function(e){this._emit("droperror",{message:e});},e}();

  /**
   * Common utilities
   * @module glMatrix
   */
  var ARRAY_TYPE$1 = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 2 Dimensional Vector
   * @module vec2
   */

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */

  function create$5() {
    var out = new ARRAY_TYPE$1(2);

    if (ARRAY_TYPE$1 != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} a new 2D vector
   */

  function fromValues$3(x, y) {
    var out = new ARRAY_TYPE$1(2);
    out[0] = x;
    out[1] = y;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec2's
   *
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Number} distance between a and b
   */

  function distance$1(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.hypot(x, y);
  }
  /**
   * Alias for {@link vec2.distance}
   * @function
   */

  var dist = distance$1;
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$3 = function () {
    var vec = create$5();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 2;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }

      return a;
    };
  }();

  /**
   * Copyright 2004-present Facebook. All Rights Reserved.
   *
   * @providesModule UserAgent_DEPRECATED
   */

  /**
   *  Provides entirely client-side User Agent and OS detection. You should prefer
   *  the non-deprecated UserAgent module when possible, which exposes our
   *  authoritative server-side PHP-based detection to the client.
   *
   *  Usage is straightforward:
   *
   *    if (UserAgent_DEPRECATED.ie()) {
   *      //  IE
   *    }
   *
   *  You can also do version checks:
   *
   *    if (UserAgent_DEPRECATED.ie() >= 7) {
   *      //  IE7 or better
   *    }
   *
   *  The browser functions will return NaN if the browser does not match, so
   *  you can also do version compares the other way:
   *
   *    if (UserAgent_DEPRECATED.ie() < 7) {
   *      //  IE6 or worse
   *    }
   *
   *  Note that the version is a float and may include a minor version number,
   *  so you should always use range operators to perform comparisons, not
   *  strict equality.
   *
   *  **Note:** You should **strongly** prefer capability detection to browser
   *  version detection where it's reasonable:
   *
   *    http://www.quirksmode.org/js/support.html
   *
   *  Further, we have a large number of mature wrapper functions and classes
   *  which abstract away many browser irregularities. Check the documentation,
   *  grep for things, or ask on javascript@lists.facebook.com before writing yet
   *  another copy of "event || window.event".
   *
   */

  var _populated = false;

  // Browsers
  var _ie, _firefox, _opera, _webkit, _chrome;

  // Actual IE browser for compatibility mode
  var _ie_real_version;

  // Platforms
  var _osx, _windows, _linux, _android;

  // Architectures
  var _win64;

  // Devices
  var _iphone, _ipad, _native;

  var _mobile;

  function _populate() {
    if (_populated) {
      return;
    }

    _populated = true;

    // To work around buggy JS libraries that can't handle multi-digit
    // version numbers, Opera 10's user agent string claims it's Opera
    // 9, then later includes a Version/X.Y field:
    //
    // Opera/9.80 (foo) Presto/2.2.15 Version/10.10
    var uas = navigator.userAgent;
    var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
    var os    = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);

    _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
    _ipad = /\b(iP[ao]d)/.exec(uas);
    _android = /Android/i.exec(uas);
    _native = /FBAN\/\w+;/i.exec(uas);
    _mobile = /Mobile/i.exec(uas);

    // Note that the IE team blog would have you believe you should be checking
    // for 'Win64; x64'.  But MSDN then reveals that you can actually be coming
    // from either x64 or ia64;  so ultimately, you should just check for Win64
    // as in indicator of whether you're in 64-bit IE.  32-bit IE on 64-bit
    // Windows will send 'WOW64' instead.
    _win64 = !!(/Win64/.exec(uas));

    if (agent) {
      _ie = agent[1] ? parseFloat(agent[1]) : (
            agent[5] ? parseFloat(agent[5]) : NaN);
      // IE compatibility mode
      if (_ie && document && document.documentMode) {
        _ie = document.documentMode;
      }
      // grab the "true" ie version from the trident token if available
      var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
      _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;

      _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
      _opera   = agent[3] ? parseFloat(agent[3]) : NaN;
      _webkit  = agent[4] ? parseFloat(agent[4]) : NaN;
      if (_webkit) {
        // We do not add the regexp to the above test, because it will always
        // match 'safari' only since 'AppleWebKit' appears before 'Chrome' in
        // the userAgent string.
        agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
        _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
      } else {
        _chrome = NaN;
      }
    } else {
      _ie = _firefox = _opera = _chrome = _webkit = NaN;
    }

    if (os) {
      if (os[1]) {
        // Detect OS X version.  If no version number matches, set _osx to true.
        // Version examples:  10, 10_6_1, 10.7
        // Parses version number as a float, taking only first two sets of
        // digits.  If only one set of digits is found, returns just the major
        // version number.
        var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);

        _osx = ver ? parseFloat(ver[1].replace('_', '.')) : true;
      } else {
        _osx = false;
      }
      _windows = !!os[2];
      _linux   = !!os[3];
    } else {
      _osx = _windows = _linux = false;
    }
  }

  var UserAgent_DEPRECATED = {

    /**
     *  Check if the UA is Internet Explorer.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    ie: function() {
      return _populate() || _ie;
    },

    /**
     * Check if we're in Internet Explorer compatibility mode.
     *
     * @return bool true if in compatibility mode, false if
     * not compatibility mode or not ie
     */
    ieCompatibilityMode: function() {
      return _populate() || (_ie_real_version > _ie);
    },


    /**
     * Whether the browser is 64-bit IE.  Really, this is kind of weak sauce;  we
     * only need this because Skype can't handle 64-bit IE yet.  We need to remove
     * this when we don't need it -- tracked by #601957.
     */
    ie64: function() {
      return UserAgent_DEPRECATED.ie() && _win64;
    },

    /**
     *  Check if the UA is Firefox.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    firefox: function() {
      return _populate() || _firefox;
    },


    /**
     *  Check if the UA is Opera.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    opera: function() {
      return _populate() || _opera;
    },


    /**
     *  Check if the UA is WebKit.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    webkit: function() {
      return _populate() || _webkit;
    },

    /**
     *  For Push
     *  WILL BE REMOVED VERY SOON. Use UserAgent_DEPRECATED.webkit
     */
    safari: function() {
      return UserAgent_DEPRECATED.webkit();
    },

    /**
     *  Check if the UA is a Chrome browser.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    chrome : function() {
      return _populate() || _chrome;
    },


    /**
     *  Check if the user is running Windows.
     *
     *  @return bool `true' if the user's OS is Windows.
     */
    windows: function() {
      return _populate() || _windows;
    },


    /**
     *  Check if the user is running Mac OS X.
     *
     *  @return float|bool   Returns a float if a version number is detected,
     *                       otherwise true/false.
     */
    osx: function() {
      return _populate() || _osx;
    },

    /**
     * Check if the user is running Linux.
     *
     * @return bool `true' if the user's OS is some flavor of Linux.
     */
    linux: function() {
      return _populate() || _linux;
    },

    /**
     * Check if the user is running on an iPhone or iPod platform.
     *
     * @return bool `true' if the user is running some flavor of the
     *    iPhone OS.
     */
    iphone: function() {
      return _populate() || _iphone;
    },

    mobile: function() {
      return _populate() || (_iphone || _ipad || _android || _mobile);
    },

    nativeApp: function() {
      // webviews inside of the native apps
      return _populate() || _native;
    },

    android: function() {
      return _populate() || _android;
    },

    ipad: function() {
      return _populate() || _ipad;
    }
  };

  var UserAgent_DEPRECATED_1 = UserAgent_DEPRECATED;

  /**
   * Copyright (c) 2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ExecutionEnvironment
   */

  var canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );

  /**
   * Simple, lightweight module assisting with the detection and context of
   * Worker. Helps avoid circular dependencies and allows code to reason about
   * whether or not they are in a Worker, even if they never include the main
   * `ReactWorker` dependency.
   */
  var ExecutionEnvironment = {

    canUseDOM: canUseDOM,

    canUseWorkers: typeof Worker !== 'undefined',

    canUseEventListeners:
      canUseDOM && !!(window.addEventListener || window.attachEvent),

    canUseViewport: canUseDOM && !!window.screen,

    isInWorker: !canUseDOM // For now, this is true - might change in the future.

  };

  var ExecutionEnvironment_1 = ExecutionEnvironment;

  var useHasFeature;
  if (ExecutionEnvironment_1.canUseDOM) {
    useHasFeature =
      document.implementation &&
      document.implementation.hasFeature &&
      // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      document.implementation.hasFeature('', '') !== true;
  }

  /**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @param {?boolean} capture Check if the capture phase is supported.
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   */
  function isEventSupported(eventNameSuffix, capture) {
    if (!ExecutionEnvironment_1.canUseDOM ||
        capture && !('addEventListener' in document)) {
      return false;
    }

    var eventName = 'on' + eventNameSuffix;
    var isSupported = eventName in document;

    if (!isSupported) {
      var element = document.createElement('div');
      element.setAttribute(eventName, 'return;');
      isSupported = typeof element[eventName] === 'function';
    }

    if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
      // This is the only way to test support for the `wheel` event in IE9+.
      isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
    }

    return isSupported;
  }

  var isEventSupported_1 = isEventSupported;

  // Reasonable defaults
  var PIXEL_STEP  = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;

  /**
   * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
   * complicated, thus this doc is long and (hopefully) detailed enough to answer
   * your questions.
   *
   * If you need to react to the mouse wheel in a predictable way, this code is
   * like your bestest friend. * hugs *
   *
   * As of today, there are 4 DOM event types you can listen to:
   *
   *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
   *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
   *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
   *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
   *
   * So what to do?  The is the best:
   *
   *   normalizeWheel.getEventType();
   *
   * In your event callback, use this code to get sane interpretation of the
   * deltas.  This code will return an object with properties:
   *
   *   spinX   -- normalized spin speed (use for zoom) - x plane
   *   spinY   -- " - y plane
   *   pixelX  -- normalized distance (to pixels) - x plane
   *   pixelY  -- " - y plane
   *
   * Wheel values are provided by the browser assuming you are using the wheel to
   * scroll a web page by a number of lines or pixels (or pages).  Values can vary
   * significantly on different platforms and browsers, forgetting that you can
   * scroll at different speeds.  Some devices (like trackpads) emit more events
   * at smaller increments with fine granularity, and some emit massive jumps with
   * linear speed or acceleration.
   *
   * This code does its best to normalize the deltas for you:
   *
   *   - spin is trying to normalize how far the wheel was spun (or trackpad
   *     dragged).  This is super useful for zoom support where you want to
   *     throw away the chunky scroll steps on the PC and make those equal to
   *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
   *     resolve a single slow step on a wheel to 1.
   *
   *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
   *     get the crazy differences between browsers, but at least it'll be in
   *     pixels!
   *
   *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
   *     should translate to positive value zooming IN, negative zooming OUT.
   *     This matches the newer 'wheel' event.
   *
   * Why are there spinX, spinY (or pixels)?
   *
   *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
   *     with a mouse.  It results in side-scrolling in the browser by default.
   *
   *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
   *
   *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
   *     probably is by browsers in conjunction with fancy 3D controllers .. but
   *     you know.
   *
   * Implementation info:
   *
   * Examples of 'wheel' event if you scroll slowly (down) by one step with an
   * average mouse:
   *
   *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
   *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
   *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
   *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
   *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
   *
   * On the trackpad:
   *
   *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
   *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
   *
   * On other/older browsers.. it's more complicated as there can be multiple and
   * also missing delta values.
   *
   * The 'wheel' event is more standard:
   *
   * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
   *
   * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
   * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
   * backward compatibility with older events.  Those other values help us
   * better normalize spin speed.  Example of what the browsers provide:
   *
   *                          | event.wheelDelta | event.detail
   *        ------------------+------------------+--------------
   *          Safari v5/OS X  |       -120       |       0
   *          Safari v5/Win7  |       -120       |       0
   *         Chrome v17/OS X  |       -120       |       0
   *         Chrome v17/Win7  |       -120       |       0
   *                IE9/Win7  |       -120       |   undefined
   *         Firefox v4/OS X  |     undefined    |       1
   *         Firefox v4/Win7  |     undefined    |       3
   *
   */
  function normalizeWheel(/*object*/ event) /*object*/ {
    var sX = 0, sY = 0,       // spinX, spinY
        pX = 0, pY = 0;       // pixelX, pixelY

    // Legacy
    if ('detail'      in event) { sY = event.detail; }
    if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
    if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
    if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

    // side scrolling on FF with DOMMouseScroll
    if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in event) { pY = event.deltaY; }
    if ('deltaX' in event) { pX = event.deltaX; }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode == 1) {          // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {                             // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
    if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

    return { spinX  : sX,
             spinY  : sY,
             pixelX : pX,
             pixelY : pY };
  }


  /**
   * The best combination if you prefer spinX + spinY normalization.  It favors
   * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
   * 'wheel' event, making spin speed determination impossible.
   */
  normalizeWheel.getEventType = function() /*string*/ {
    return (UserAgent_DEPRECATED_1.firefox())
             ? 'DOMMouseScroll'
             : (isEventSupported_1('wheel'))
                 ? 'wheel'
                 : 'mousewheel';
  };

  var normalizeWheel_1 = normalizeWheel;

  var normalizeWheel$1 = normalizeWheel_1;

  // this class wraps all the observables for the gltf sample viewer state
  // the data streams coming out of this should match the data required in GltfState
  // as close as possible
  class UIModel
  {
      constructor(app, modelPathProvider, environments)
      {
          this.app = app;
          this.pathProvider = modelPathProvider;

          this.app.models = this.pathProvider.getAllKeys();

          const dropdownGltfChanged = app.modelChanged$.pipe(
              pluck("event", "msg"),
              startWith("FlightHelmet"),
              map(value => {
                  app.flavours = this.pathProvider.getModelFlavours(value);
                  app.selectedFlavour = "glTF";
                  return this.pathProvider.resolve(value, app.selectedFlavour);
              }),
              map( value => ({mainFile: value, additionalFiles: undefined})),
          );

          const dropdownFlavourChanged = app.flavourChanged$.pipe(
              pluck("event", "msg"),
              map(value => {
                  return this.pathProvider.resolve(app.selectedModel, value);
              }),
              map( value => ({mainFile: value, additionalFiles: undefined})),
          );

          this.scene = app.sceneChanged$.pipe(pluck("event", "msg"));
          this.camera = app.cameraChanged$.pipe(pluck("event", "msg"));
          this.environmentRotation = app.environmentRotationChanged$.pipe(pluck("event", "msg"));
          this.app.environments = environments;
          const selectedEnvironment = app.$watchAsObservable('selectedEnvironment').pipe(
              pluck('newValue'),
              map( environmentName => this.app.environments[environmentName].hdr_path)
          );
          const initialEnvironment = "footprint_court";
          this.app.selectedEnvironment = initialEnvironment;

          this.app.tonemaps = Object.keys(GltfState.ToneMaps).map((key) => {
              return {title: GltfState.ToneMaps[key]};
          });
          this.tonemap = app.tonemapChanged$.pipe(
              pluck("event", "msg"),
              startWith(GltfState.ToneMaps.LINEAR)
          );

          this.app.debugchannels = Object.keys(GltfState.DebugOutput).map((key) => {
              return {title: GltfState.DebugOutput[key]};
          });
          this.debugchannel = app.debugchannelChanged$.pipe(
              pluck("event", "msg"),
              startWith(GltfState.DebugOutput.NONE)
          );

          this.exposurecompensation = app.exposureChanged$.pipe(pluck("event", "msg"));
          this.skinningEnabled = app.skinningChanged$.pipe(pluck("event", "msg"));
          this.morphingEnabled = app.morphingChanged$.pipe(pluck("event", "msg"));
          this.clearcoatEnabled = app.clearcoatChanged$.pipe(pluck("event", "msg"));
          this.sheenEnabled = app.sheenChanged$.pipe(pluck("event", "msg"));
          this.transmissionEnabled = app.transmissionChanged$.pipe(pluck("event", "msg"));
          this.volumeEnabled = app.$watchAsObservable('volumeEnabled').pipe(
                                              map( ({ newValue, oldValue }) => newValue));
          this.iorEnabled = app.$watchAsObservable('iorEnabled').pipe(
                                              map( ({ newValue, oldValue }) => newValue));
          this.specularEnabled = app.$watchAsObservable('specularEnabled').pipe(
                                              map( ({ newValue, oldValue }) => newValue));
          this.iblEnabled = app.iblChanged$.pipe(pluck("event", "msg"));
          this.punctualLightsEnabled = app.punctualLightsChanged$.pipe(pluck("event", "msg"));
          this.renderEnvEnabled = app.$watchAsObservable('renderEnv').pipe(
                                              map( ({ newValue, oldValue }) => newValue));
          this.blurEnvEnabled = app.blurEnvChanged$.pipe(pluck("event", "msg"));
          this.addEnvironment = app.$watchAsObservable('uploadedHDR').pipe(
              pluck('newValue')
          );
          this.captureCanvas = app.captureCanvas$.pipe(pluck('event'));
          this.cameraValuesExport = app.cameraExport$.pipe(pluck('event'));

          const initialClearColor = "#303542";
          this.app.clearColor = initialClearColor;
          this.clearColor = app.colorChanged$.pipe(
              filter(value => value.event !== undefined),
              pluck("event", "msg"),
              startWith(initialClearColor),
              map(hex => {
                  // convert hex string to rgb values
                  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                  return result ? [
                      parseInt(result[1], 16),
                      parseInt(result[2], 16),
                      parseInt(result[3], 16),
                      255
                  ] : null;
              })
          );

          this.animationPlay = app.animationPlayChanged$.pipe(pluck("event", "msg"));
          this.activeAnimations = app.$watchAsObservable('selectedAnimations').pipe(
              map( ({ newValue, oldValue }) => newValue)
          );

          const canvas = document.getElementById("canvas");
          this.registerDropZoneUIHandle(canvas);
          const inputObservables = UIModel.getInputObservables(canvas, this.app);
          this.model = merge$1(dropdownGltfChanged, dropdownFlavourChanged, inputObservables.gltfDropped);
          this.hdr = merge$1(inputObservables.hdrDropped, selectedEnvironment, this.addEnvironment).pipe(
              startWith(environments[initialEnvironment].hdr_path)
          );

          const hdrUIChange = merge$1(inputObservables.hdrDropped, this.addEnvironment);
          hdrUIChange.subscribe( hdrPath => {
              this.app.environments[hdrPath.name] = {
                  title: hdrPath.name,
                  hdr_path: hdrPath,
              };
              this.app.selectedEnvironment = hdrPath.name;
          });

          this.variant = app.variantChanged$.pipe(pluck("event", "msg"));

          this.model.subscribe(() => {
              // remove last filename
              if(this.app.models[this.app.models.length -1] === this.lastDroppedFilename)
              {
                  this.app.models.pop();
                  this.lastDroppedFilename = undefined;
              }
          });

          const dropedGLtfFileName = inputObservables.gltfDropped.pipe(
              map( (data) => {
                  return data.mainFile.name;
              })
          );
          dropedGLtfFileName.subscribe( (filename) => {
              if(filename !== undefined)
              {
                  filename = filename.split('/').pop();
                  let fileExtension = filename.split('.').pop();                filename = filename.substr(0, filename.lastIndexOf('.'));

                  this.app.models.push(filename);
                  this.app.selectedModel = filename;
                  this.lastDroppedFilename = filename;

                  app.flavours = [fileExtension];
                  app.selectedFlavour = fileExtension;
              }
          });

          this.orbit = inputObservables.orbit;
          this.pan = inputObservables.pan;
          this.zoom = inputObservables.zoom;
      }

      // app has to be the vuejs app instance
      static getInputObservables(inputDomElement, app)
      {
          const observables = {};

          const simpleDropzoneObservabel = new Observable(subscriber => {
              const dropCtrl = new xe(inputDomElement, inputDomElement);
              dropCtrl.on('drop', ({files}) => {
                  app.showDropDownOverlay = false;
                  subscriber.next(files);
              });
              dropCtrl.on('droperror', () => {
                  app.showDropDownOverlay = false;
                  subscriber.error();
              });
          });
          observables.filesDropped = simpleDropzoneObservabel.pipe(
              map(files => Array.from(files.values()))
          );

          observables.gltfDropped = observables.filesDropped.pipe(
              // filter out any non .gltf or .glb files

              map( (files) => {
                  // restructure the data by separating mainFile (gltf/glb) from additionalFiles
                  const mainFile = files.find( (file) => file.name.endsWith(".glb") || file.name.endsWith(".gltf"));
                  const additionalFiles = files.filter( (file) => file !== mainFile);
                  return {mainFile: mainFile, additionalFiles: additionalFiles};
              }),
              filter(files => files.mainFile !== undefined),
          );
          observables.hdrDropped = observables.filesDropped.pipe(
              map( (files) => {
                  // extract only the hdr file from the stream of files
                  return files.find( (file) => file.name.endsWith(".hdr"));
              }),
              filter(file => file !== undefined),
          );

          const move = fromEvent(document, 'mousemove');
          const mousedown = fromEvent(inputDomElement, 'mousedown');
          const cancelMouse = merge$1(fromEvent(document, 'mouseup'), fromEvent(document, 'mouseleave'));

          const mouseOrbit = mousedown.pipe(
              filter( event => event.button === 0 && event.shiftKey === false),
              mergeMap(() => move.pipe(takeUntil(cancelMouse))),
              map( mouse => ({deltaPhi: mouse.movementX, deltaTheta: mouse.movementY }))
          );

          const mousePan = mousedown.pipe(
              filter( event => event.button === 1 || event.shiftKey === true),
              mergeMap(() => move.pipe(takeUntil(cancelMouse))),
              map( mouse => ({deltaX: mouse.movementX, deltaY: mouse.movementY }))
          );

          const smbZoom = mousedown.pipe(
              filter( event => event.button === 2),
              mergeMap(() => move.pipe(takeUntil(cancelMouse))),
              map( mouse => ({deltaZoom: mouse.movementY }))
          );
          const wheelZoom = fromEvent(inputDomElement, 'wheel').pipe(
              map(wheelEvent => normalizeWheel$1(wheelEvent)),
              map(normalizedZoom => ({deltaZoom: normalizedZoom.spinY }))
          );
          inputDomElement.addEventListener('onscroll', event => event.preventDefault(), false);
          const mouseZoom = merge$1(smbZoom, wheelZoom);

          const touchmove = fromEvent(document, 'touchmove');
          const touchstart = fromEvent(inputDomElement, 'touchstart');
          const touchend = merge$1(fromEvent(inputDomElement, 'touchend'), fromEvent(inputDomElement, 'touchcancel'));
          
          const touchOrbit = touchstart.pipe(
              filter( event => event.touches.length === 1),
              mergeMap(() => touchmove.pipe(takeUntil(touchend))),
              map( event => event.touches[0]),
              pairwise(),
              map( ([oldTouch, newTouch]) => {
                  return { 
                      deltaPhi: newTouch.pageX - oldTouch.pageX, 
                      deltaTheta: newTouch.pageY - oldTouch.pageY 
                  };
              })
          );

          const touchZoom = touchstart.pipe(
              filter( event => event.touches.length === 2),
              mergeMap(() => touchmove.pipe(takeUntil(touchend))),
              map( event => {
                  const pos1 = fromValues$3(event.touches[0].pageX, event.touches[0].pageY);
                  const pos2 = fromValues$3(event.touches[1].pageX, event.touches[1].pageY);
                  return dist(pos1, pos2);
              }),
              pairwise(),
              map( ([oldDist, newDist]) => ({ deltaZoom: newDist - oldDist }))
          );

          inputDomElement.addEventListener('ontouchmove', event => event.preventDefault(), false);

          observables.orbit = merge$1(mouseOrbit, touchOrbit);
          observables.pan = mousePan;
          observables.zoom = merge$1(mouseZoom, touchZoom);

          // disable context menu
          inputDomElement.oncontextmenu = () => false;

          return observables;
      }

      registerDropZoneUIHandle(inputDomElement)
      {
          const self = this;
          inputDomElement.addEventListener('dragenter', function(event) {
              self.app.showDropDownOverlay = true;
          });
          inputDomElement.addEventListener('dragleave', function(event) {
              self.app.showDropDownOverlay = false;
          });
      }

      attachGltfLoaded(glTFLoadedStateObservable)
      {
          const gltfLoadedAndInit = glTFLoadedStateObservable.pipe(
              map( state => state.gltf )
          );

          // update scenes
          const sceneIndices = gltfLoadedAndInit.pipe(
              map( (gltf) => {
                  return gltf.scenes.map( (scene, index) => {
                      let name = scene.name;
                      if(name === "" || name === undefined)
                      {
                          name = index;
                      }
                      return {title: name, index: index};
                  });
              })
          );
          sceneIndices.subscribe( (scenes) => {
              this.app.scenes = scenes;
          });

          const loadedSceneIndex = glTFLoadedStateObservable.pipe(
              map( (state) => state.sceneIndex)
          );
          loadedSceneIndex.subscribe( (scene) => {
              this.app.selectedScene = scene;
          });

          // update cameras
          this.attachCameraChangeObservable(glTFLoadedStateObservable);

          const variants = gltfLoadedAndInit.pipe(
              map( (gltf) => {
                  if(gltf.variants !== undefined)
                  {
                      return gltf.variants.map( (variant, index) => {
                          return {title: variant.name};
                      });
                  }
                  return [];
              }),
              map(variants => {
                  // Add a "None" variant to the beginning
                  variants.unshift({title: "None"});
                  return variants;
              })
          );
          variants.subscribe( (variants) => {
              this.app.materialVariants = variants;
          });

          gltfLoadedAndInit.subscribe(
              (_) => {this.app.setAnimationState(true);
              }
          );

          const xmpData = gltfLoadedAndInit.pipe(
              map( (gltf) => {
                  if(gltf.extensions !== undefined && gltf.extensions.KHR_xmp_json_ld !== undefined)
                  {
                      if(gltf.asset.extensions !== undefined && gltf.asset.extensions.KHR_xmp_json_ld !== undefined)
                      {
                          let xmpPacket = gltf.extensions.KHR_xmp_json_ld.packets[gltf.asset.extensions.KHR_xmp_json_ld.packet];
                          return xmpPacket;
                      }
                  }
                  return [];
              })
          );
          xmpData.subscribe( (xmpData) => {
              this.app.xmp = xmpData;
          });

          const animations = gltfLoadedAndInit.pipe(
              map( gltf =>  gltf.animations.map( (anim, index) => {
                  let name = anim.name;
                  if (name === undefined || name === "")
                  {
                      name = index;
                  }
                  return {
                      title: name,
                      index: index
                  };
              }))
          );
          animations.subscribe( animations => {
              this.app.animations = animations;
          });

          glTFLoadedStateObservable.pipe(
              map( state => state.animationIndices)
          ).subscribe( animationIndices => {
              this.app.selectedAnimations = animationIndices;
          });
      }

      updateStatistics(statisticsUpdateObservable)
      {
          statisticsUpdateObservable.subscribe(
              data => {
                  let statistics = {};
                  statistics["Mesh Count"] = data.meshCount;
                  statistics["Triangle Count"] = data.faceCount;
                  statistics["Opaque Material Count"] = data.opaqueMaterialsCount;
                  statistics["Transparent Material Count"] = data.transparentMaterialsCount;
                  this.app.statistics = statistics;
              }
          );
      }

      disabledAnimations(disabledAnimationsObservable)
      {
          disabledAnimationsObservable.subscribe(
              data => { this.app.disabledAnimations = data; }
          );
      }

      attachCameraChangeObservable(sceneChangeObservable)
      {
          const cameraIndices = sceneChangeObservable.pipe(
              map( (state) => {
                  let gltf = state.gltf;
                  let cameraIndices = [{title: "User Camera", index: -1}];
                  if (gltf.scenes[state.sceneIndex] !== undefined)
                  {
                      cameraIndices.push(...gltf.cameras.map( (camera, index) => {
                          if(gltf.scenes[state.sceneIndex].includesNode(gltf, camera.node))
                          {
                              let name = camera.name;
                              if(name === "" || name === undefined)
                              {
                                  name = index;
                              }
                              return {title: name, index: index};
                          }
                      }));
                  }
                  cameraIndices = cameraIndices.filter(function(el) {
                      return el !== undefined;
                  });
                  return cameraIndices;
              })
          );
          cameraIndices.subscribe( (cameras) => {
              this.app.cameras = cameras;
          });
          const loadedCameraIndex = sceneChangeObservable.pipe(
              map( (state) => {
                  return state.cameraIndex;
              })
          );
          loadedCameraIndex.subscribe( index => {
              if(index ===  undefined)
              {
                  index = -1;
              }
              this.app.selectedCamera = index;
          });
      }

      copyToClipboard(text) {
          var dummy = document.createElement("textarea");
          document.body.appendChild(dummy);
          dummy.value = text;
          dummy.select();
          document.execCommand("copy");
          document.body.removeChild(dummy);
      }

      goToLoadingState() {
          this.app.goToLoadingState();
      }
      exitLoadingState()
      {
          this.app.exitLoadingState();
      }
  }

  var Vue$1;
  var warn = function () {};

  // NOTE(benlesh): the value of this method seems dubious now, but I'm not sure
  // if this is a Vue convention I'm just not familiar with. Perhaps it would
  // be better to just import and use Vue directly?
  function install (_Vue) {
    Vue$1 = _Vue;
    warn = Vue$1.util.warn || warn;
  }

  // TODO(benlesh): as time passes, this should be updated to use RxJS 6.1's
  // `isObservable` method. But wait until you're ready to drop support for Rx 5
  function isObservable (ob) {
    return ob && typeof ob.subscribe === 'function'
  }

  function isObserver (subject) {
    return subject && (
      typeof subject.next === 'function'
    )
  }

  function defineReactive (vm, key, val) {
    if (key in vm) {
      vm[key] = val;
    } else {
      Vue$1.util.defineReactive(vm, key, val);
    }
  }

  function getKey (binding) {
    return [binding.arg].concat(Object.keys(binding.modifiers)).join(':')
  }

  var rxMixin = {
    created: function created () {
      var vm = this;
      var domStreams = vm.$options.domStreams;
      if (domStreams) {
        domStreams.forEach(function (key) {
          vm[key] = new Subject();
        });
      }

      var observableMethods = vm.$options.observableMethods;
      if (observableMethods) {
        if (Array.isArray(observableMethods)) {
          observableMethods.forEach(function (methodName) {
            vm[ methodName + '$' ] = vm.$createObservableMethod(methodName);
          });
        } else {
          Object.keys(observableMethods).forEach(function (methodName) {
            vm[observableMethods[methodName]] = vm.$createObservableMethod(methodName);
          });
        }
      }

      var obs = vm.$options.subscriptions;
      if (typeof obs === 'function') {
        obs = obs.call(vm);
      }
      if (obs) {
        vm.$observables = {};
        vm._subscription = new Subscription();
        Object.keys(obs).forEach(function (key) {
          defineReactive(vm, key, undefined);
          var ob = vm.$observables[key] = obs[key];
          if (!isObservable(ob)) {
            warn(
              'Invalid Observable found in subscriptions option with key "' + key + '".',
              vm
            );
            return
          }
          vm._subscription.add(obs[key].subscribe(function (value) {
            vm[key] = value;
          }, function (error) { throw error }));
        });
      }
    },

    beforeDestroy: function beforeDestroy () {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }
    }
  };

  var streamDirective = {
    // Example ./example/counter_dir.html
    bind: function bind (el, binding, vnode) {
      var handle = binding.value;
      var event = binding.arg;
      var streamName = binding.expression;
      var modifiers = binding.modifiers;

      if (isObserver(handle)) {
        handle = { subject: handle };
      } else if (!handle || !isObserver(handle.subject)) {
        warn(
          'Invalid Subject found in directive with key "' + streamName + '".' +
          streamName + ' should be an instance of Subject or have the ' +
          'type { subject: Subject, data: any }.',
          vnode.context
        );
        return
      }

      var modifiersFuncs = {
        stop: function (e) { return e.stopPropagation(); },
        prevent: function (e) { return e.preventDefault(); }
      };

      var modifiersExists = Object.keys(modifiersFuncs).filter(
        function (key) { return modifiers[key]; }
      );

      var subject = handle.subject;
      var next = (subject.next || subject.onNext).bind(subject);

      if (!modifiers.native && vnode.componentInstance) {
        handle.subscription = vnode.componentInstance.$eventToObservable(event).subscribe(function (e) {
          modifiersExists.forEach(function (mod) { return modifiersFuncs[mod](e); });
          next({
            event: e,
            data: handle.data
          });
        });
      } else {
        var fromEventArgs = handle.options ? [el, event, handle.options] : [el, event];
        handle.subscription = fromEvent.apply(void 0, fromEventArgs).subscribe(function (e) {
          modifiersExists.forEach(function (mod) { return modifiersFuncs[mod](e); });
          next({
            event: e,
            data: handle.data
          });
        });
      }
  (el._rxHandles || (el._rxHandles = {}))[getKey(binding)] = handle;
    },

    update: function update (el, binding) {
      var handle = binding.value;
      var _handle = el._rxHandles && el._rxHandles[getKey(binding)];
      if (_handle && handle && isObserver(handle.subject)) {
        _handle.data = handle.data;
      }
    },

    unbind: function unbind (el, binding) {
      var key = getKey(binding);
      var handle = el._rxHandles && el._rxHandles[key];
      if (handle) {
        if (handle.subscription) {
          handle.subscription.unsubscribe();
        }
        el._rxHandles[key] = null;
      }
    }
  };

  function watchAsObservable (expOrFn, options) {
    var vm = this;
    var obs$ = new Observable(function (observer) {
      var _unwatch;
      var watch = function () {
        _unwatch = vm.$watch(expOrFn, function (newValue, oldValue) {
          observer.next({ oldValue: oldValue, newValue: newValue });
        }, options);
      };

      // if $watchAsObservable is called inside the subscriptions function,
      // because data hasn't been observed yet, the watcher will not work.
      // in that case, wait until created hook to watch.
      if (vm._data) {
        watch();
      } else {
        vm.$once('hook:created', watch);
      }

      // Returns function which disconnects the $watch expression
      return new Subscription(function () {
        _unwatch && _unwatch();
      })
    });

    return obs$
  }

  function fromDOMEvent (selector, event) {
    if (typeof window === 'undefined') {
      // TODO(benlesh): I'm not sure if this is really what you want here,
      // but it's equivalent to what you were doing. You might want EMPTY
      return NEVER
    }

    var vm = this;
    var doc = document.documentElement;
    var obs$ = new Observable(function (observer) {
      function listener (e) {
        if (!vm.$el) { return }
        if (selector === null && vm.$el === e.target) { return observer.next(e) }
        var els = vm.$el.querySelectorAll(selector);
        var el = e.target;
        for (var i = 0, len = els.length; i < len; i++) {
          if (els[i] === el) { return observer.next(e) }
        }
      }
      doc.addEventListener(event, listener);
      // Returns function which disconnects the $watch expression
      return new Subscription(function () {
        doc.removeEventListener(event, listener);
      })
    });

    return obs$
  }

  function subscribeTo$1 (observable, next, error, complete) {
    var subscription = observable.subscribe(next, error, complete)
    ;(this._subscription || (this._subscription = new Subscription())).add(subscription);
    return subscription
  }

  /**
   * @see {@link https://vuejs.org/v2/api/#vm-on}
   * @param {String||Array} evtName Event name
   * @return {Observable} Event stream
   */
  function eventToObservable (evtName) {
    var vm = this;
    var evtNames = Array.isArray(evtName) ? evtName : [evtName];
    var obs$ = new Observable(function (observer) {
      var eventPairs = evtNames.map(function (name) {
        var callback = function (msg) { return observer.next({ name: name, msg: msg }); };
        vm.$on(name, callback);
        return { name: name, callback: callback }
      });
      return function () {
        // Only remove the specific callback
        eventPairs.forEach(function (pair) { return vm.$off(pair.name, pair.callback); });
      }
    });

    return obs$
  }

  /**
   * @name Vue.prototype.$createObservableMethod
   * @description Creates an observable from a given function name.
   * @param {String} methodName Function name
   * @param {Boolean} [passContext] Append the call context at the end of emit data?
   * @return {Observable} Hot stream
   */
  function createObservableMethod (methodName, passContext) {
    var vm = this;

    if (vm[methodName] !== undefined) {
      warn(
        'Potential bug: ' +
        "Method " + methodName + " already defined on vm and has been overwritten by $createObservableMethod." +
        String(vm[methodName]),
        vm
      );
    }

    var creator = function (observer) {
      vm[methodName] = function () {
        var args = Array.from(arguments);
        if (passContext) {
          args.push(this);
          observer.next(args);
        } else {
          if (args.length <= 1) {
            observer.next(args[0]);
          } else {
            observer.next(args);
          }
        }
      };
      return function () {
        delete vm[methodName];
      }
    };

    // Must be a hot stream otherwise function context may overwrite over and over again
    return new Observable(creator).pipe(share())
  }

  /* global Vue */

  function VueRx (Vue) {
    install(Vue);
    Vue.mixin(rxMixin);
    Vue.directive('stream', streamDirective);
    Vue.prototype.$watchAsObservable = watchAsObservable;
    Vue.prototype.$fromDOMEvent = fromDOMEvent;
    Vue.prototype.$subscribeTo = subscribeTo$1;
    Vue.prototype.$eventToObservable = eventToObservable;
    Vue.prototype.$createObservableMethod = createObservableMethod;
    Vue.config.optionMergeStrategies.subscriptions = Vue.config.optionMergeStrategies.data;
  }

  // auto install
  if (typeof Vue !== 'undefined') {
    Vue.use(VueRx);
  }

  Vue.use(VueRx, { Subject });

  // general components
  Vue.component('toggle-button', {
      props: ['ontext', 'offtext'],
      template:'#toggleButtonTemplate',
      data(){
          return {
              name: "Play",
              isOn: false
          };
      },
      mounted(){
          this.name = this.ontext;
      },
      methods:
      {
          buttonclicked: function(value)
          {
              this.isOn = !this.isOn;
              this.name = this.isOn ? this.ontext : this.offtext;
              this.$emit('buttonclicked', this.isOn);
          },
          setState: function(value)
          {
              this.isOn = value;
              this.name = this.isOn ? this.ontext : this.offtext;
          }
      }
  });
  Vue.component('json-to-ui-template', {
      props: ['data', 'isinner'],
      template:'#jsonToUITemplate'
  });

  const app = new Vue({
      domStreams: ['modelChanged$', 'flavourChanged$', 'sceneChanged$', 'cameraChanged$',
          'environmentChanged$', 'debugchannelChanged$', 'tonemapChanged$', 'skinningChanged$',
          'punctualLightsChanged$', 'iblChanged$', 'blurEnvChanged$', 'morphingChanged$',
          'addEnvironment$', 'colorChanged$', 'environmentRotationChanged$', 'animationPlayChanged$', 'selectedAnimationsChanged$',
          'variantChanged$', 'exposureChanged$', "clearcoatChanged$", "sheenChanged$", "transmissionChanged$",
          'cameraExport$', 'captureCanvas$'],
      data() {
          return {
              fullheight: true,
              right: true,
              models: ["FlightHelmet"],
              flavours: ["glTF", "glTF-Binary", "glTF-Quantized", "glTF-Draco", "glTF-pbrSpecularGlossiness"],
              scenes: [{title: "0"}, {title: "1"}],
              cameras: [{title: "User Camera", index: -1}],
              materialVariants: [{title: "None"}],

              animations: [{title: "cool animation"}, {title: "even cooler"}, {title: "not cool"}, {title: "Do not click!"}],
              tonemaps: [{title: "None"}],
              debugchannels: [{title: "None"}],
              xmp: [{title: "xmp"}],
              statistics: [],

              selectedModel: "FlightHelmet",
              selectedFlavour: "",
              selectedScene: {},
              selectedCamera: {},
              selectedVariant: "None",
              selectedAnimations: [],
              disabledAnimations: [],

              ibl: true,
              punctualLights: true,
              renderEnv: true,
              blurEnv: true,
              clearColor: "",
              environmentRotations: [{title: "+Z"}, {title: "-X"}, {title: "-Z"}, {title: "+X"}],
              selectedEnvironmentRotation: "+Z",
              environments: [{index: 0, name: ""}],
              selectedEnvironment: 0,

              debugChannel: "None",
              exposureSetting: 0,
              toneMap: "None",
              skinning: true,
              morphing: true,
              clearcoatEnabled: true,
              sheenEnabled: true,
              transmissionEnabled: true,
              volumeEnabled: true,
              iorEnabled: true,
              specularEnabled: true,

              activeTab: 0,
              loadingComponent: {},
              showDropDownOverlay: false,
              uploadedHDR: undefined,

              // these are handls for certain ui change related things
              environmentVisiblePrefState: true,
              volumeEnabledPrefState: true,
          };
      },
      mounted: function()
      {
          // remove input class from color picker (added by default by buefy)
          const colorPicker = document.getElementById("clearColorPicker");
          colorPicker.classList.remove("input");
      },
      methods:
      {
          setAnimationState: function(value)
          {
              this.$refs.animationState.setState(value);
          },
          iblTriggered: function(value)
          {
              if(this.ibl == false)
              {
                  this.environmentVisiblePrefState = this.renderEnv;
                  this.renderEnv = false;
              }
              else {
                  this.renderEnv = this.environmentVisiblePrefState;
              }
          },
          transmissionTriggered: function(value)
          {
              if(this.transmissionEnabled == false)
              {
                  this.volumeEnabledPrefState = this.volumeEnabled;
                  this.volumeEnabled = false;
              }
              else {
                  this.volumeEnabled = this.volumeEnabledPrefState;
              }
          },
          warn(message) {
              this.$buefy.toast.open({
                  message: message,
                  type: 'is-warning'
              });
          },
          error(message) {
              this.$buefy.toast.open({
                  message: message,
                  type: 'is-danger',
                  duration: 5000
              });
          },
          goToLoadingState() {
              if(this.loadingComponent === undefined)
              {
                  return;
              }
              this.loadingComponent = this.$buefy.loading.open({
                  container: null
              });
          },
          exitLoadingState()
          {
              if(this.loadingComponent === undefined)
              {
                  return;
              }
              this.loadingComponent.close();
          },
          onFileChange(e) {
              const file = e.target.files[0];
              this.uploadedHDR = file;
          },
      }
  }).$mount('#app');

  // pipe error messages to UI
  (function(){

      var originalWarn = console.warn;
      var originalError = console.error;

      console.warn = function(txt) {
          app.warn(txt);
          originalWarn.apply(console, arguments);
      };
      console.error = function(txt) {
          app.error(txt);
          originalError.apply(console, arguments);
      };

      window.onerror = function(msg, url, lineNo, columnNo, error) {
          var message = [
              'Message: ' + msg,
              'URL: ' + url,
              'Line: ' + lineNo,
              'Column: ' + columnNo,
              'Error object: ' + JSON.stringify(error)
            ].join(' - ');
          app.error(message);
      };
  })();

  var bind$1 = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString$2 = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray$2(val) {
    return toString$2.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined$1(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer$1(val) {
    return val !== null && !isUndefined$1(val) && val.constructor !== null && !isUndefined$1(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer$1(val) {
    return toString$2.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData$1(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView$1(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString$1(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber$1(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject$2(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject$1(val) {
    if (toString$2.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate$1(val) {
    return toString$2.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile$1(val) {
    return toString$2.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob$1(val) {
    return toString$2.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction$2(val) {
    return toString$2.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream$1(val) {
    return isObject$2(val) && isFunction$2(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams$1(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim$1(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv$1() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach$4(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray$2(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge$2(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject$1(result[key]) && isPlainObject$1(val)) {
        result[key] = merge$2(result[key], val);
      } else if (isPlainObject$1(val)) {
        result[key] = merge$2({}, val);
      } else if (isArray$2(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach$4(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend$1(a, b, thisArg) {
    forEach$4(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM$1(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils$1 = {
    isArray: isArray$2,
    isArrayBuffer: isArrayBuffer$1,
    isBuffer: isBuffer$1,
    isFormData: isFormData$1,
    isArrayBufferView: isArrayBufferView$1,
    isString: isString$1,
    isNumber: isNumber$1,
    isObject: isObject$2,
    isPlainObject: isPlainObject$1,
    isUndefined: isUndefined$1,
    isDate: isDate$1,
    isFile: isFile$1,
    isBlob: isBlob$1,
    isFunction: isFunction$2,
    isStream: isStream$1,
    isURLSearchParams: isURLSearchParams$1,
    isStandardBrowserEnv: isStandardBrowserEnv$1,
    forEach: forEach$4,
    merge: merge$2,
    extend: extend$1,
    trim: trim$1,
    stripBOM: stripBOM$1
  };

  function encode$2(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL$1 = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$1.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils$1.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils$1.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils$1.forEach(val, function parseValue(v) {
          if (utils$1.isDate(v)) {
            v = v.toISOString();
          } else if (utils$1.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode$2(key) + '=' + encode$2(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager$1() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager$1.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager$1.prototype.forEach = function forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1$1 = InterceptorManager$1;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData$1 = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils$1.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel$1 = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
    utils$1.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError$1 = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError$1 = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError$1(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle$1 = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError$1(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  var cookies$1 = (
    utils$1.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils$1.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils$1.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils$1.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL$1 = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL$1(requestedURL)) {
      return combineURLs$1(baseURL, requestedURL);
    }
    return requestedURL;
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf$1 = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders$1 = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils$1.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils$1.trim(line.substr(0, i)).toLowerCase();
      val = utils$1.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf$1.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isURLSameOrigin$1 = (
    utils$1.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils$1.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var xhr$1 = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils$1.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath$1(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders$1(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle$1(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError$1('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError$1('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError$1(timeoutErrorMessage, config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils$1.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin$1(fullPath)) && config.xsrfCookieName ?
          cookies$1.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$1.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils$1.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE$1 = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset$1(headers, value) {
    if (!utils$1.isUndefined(headers) && utils$1.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter$1() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr$1;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr$1;
    }
    return adapter;
  }

  var defaults$1 = {
    adapter: getDefaultAdapter$1(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName$1(headers, 'Accept');
      normalizeHeaderName$1(headers, 'Content-Type');
      if (utils$1.isFormData(data) ||
        utils$1.isArrayBuffer(data) ||
        utils$1.isBuffer(data) ||
        utils$1.isStream(data) ||
        utils$1.isFile(data) ||
        utils$1.isBlob(data)
      ) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        setContentTypeIfUnset$1(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils$1.isObject(data)) {
        setContentTypeIfUnset$1(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults$1.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils$1.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults$1.headers[method] = {};
  });

  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults$1.headers[method] = utils$1.merge(DEFAULT_CONTENT_TYPE$1);
  });

  var defaults_1$1 = defaults$1;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested$1(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest$1 = function dispatchRequest(config) {
    throwIfCancellationRequested$1(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData$1(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils$1.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1$1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested$1(config);

      // Transform response data
      response.data = transformData$1(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested$1(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData$1(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig$1 = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
    var defaultToConfig2Keys = [
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
      'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
    ];
    var directMergeKeys = ['validateStatus'];

    function getMergedValue(target, source) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge(target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    function mergeDeepProperties(prop) {
      if (!utils$1.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$1.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    }

    utils$1.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils$1.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      }
    });

    utils$1.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

    utils$1.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils$1.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      } else if (!utils$1.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    utils$1.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys)
      .concat(directMergeKeys);

    var otherKeys = Object
      .keys(config1)
      .concat(Object.keys(config2))
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils$1.forEach(otherKeys, mergeDeepProperties);

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1$1(),
      response: new InterceptorManager_1$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios$1.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig$1(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    // Hook up interceptors middleware
    var chain = [dispatchRequest$1, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios$1.prototype.getUri = function getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    return buildURL$1(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1$1 = Axios$1;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel$1(message) {
    this.message = message;
  }

  Cancel$1.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel$1.prototype.__CANCEL__ = true;

  var Cancel_1$1 = Cancel$1;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken$1(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1$1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken$1.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken$1.source = function source() {
    var cancel;
    var token = new CancelToken$1(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1$1 = CancelToken$1;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread$1 = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError$1 = function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance$1(defaultConfig) {
    var context = new Axios_1$1(defaultConfig);
    var instance = bind$1(Axios_1$1.prototype.request, context);

    // Copy axios.prototype to instance
    utils$1.extend(instance, Axios_1$1.prototype, context);

    // Copy context to instance
    utils$1.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios$2 = createInstance$1(defaults_1$1);

  // Expose Axios class to allow class inheritance
  axios$2.Axios = Axios_1$1;

  // Factory for creating new instances
  axios$2.create = function create(instanceConfig) {
    return createInstance$1(mergeConfig$1(axios$2.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios$2.Cancel = Cancel_1$1;
  axios$2.CancelToken = CancelToken_1$1;
  axios$2.isCancel = isCancel$1;

  // Expose all/spread
  axios$2.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$2.spread = spread$1;

  // Expose isAxiosError
  axios$2.isAxiosError = isAxiosError$1;

  var axios_1$1 = axios$2;

  // Allow use of default import syntax in TypeScript
  var default_1$1 = axios$2;
  axios_1$1.default = default_1$1;

  var axios$3 = axios_1$1;

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  // resolves . and .. elements in a path array with directory names there
  // must be no slashes, empty elements, or device names (c:\) in the array
  // (so also no leading and trailing slashes - it does not distinguish
  // relative and absolute paths)
  function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift('..');
      }
    }

    return parts;
  }

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  // path.resolve([from ...], to)
  // posix version
  function resolve() {
    var resolvedPath = '',
        resolvedAbsolute = false;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : '/';

      // Skip empty and invalid entries
      if (typeof path !== 'string') {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(filter$1(resolvedPath.split('/'), function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/');

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  }
  // path.normalize(path)
  // posix version
  function normalize$3(path) {
    var isPathAbsolute = isAbsolute(path),
        trailingSlash = substr(path, -1) === '/';

    // Normalize the path
    path = normalizeArray(filter$1(path.split('/'), function(p) {
      return !!p;
    }), !isPathAbsolute).join('/');

    if (!path && !isPathAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isPathAbsolute ? '/' : '') + path;
  }
  // posix version
  function isAbsolute(path) {
    return path.charAt(0) === '/';
  }

  // posix version
  function join() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalize$3(filter$1(paths, function(p, index) {
      if (typeof p !== 'string') {
        throw new TypeError('Arguments to path.join must be strings');
      }
      return p;
    }).join('/'));
  }


  // path.relative(from, to)
  // posix version
  function relative(from, to) {
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
  }

  var sep = '/';
  var delimiter = ':';

  function dirname(path) {
    var result = splitPath(path),
        root = result[0],
        dir = result[1];

    if (!root && !dir) {
      // No dirname whatsoever
      return '.';
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }

    return root + dir;
  }

  function basename(path, ext) {
    var f = splitPath(path)[2];
    // TODO: make this comparison case-insensitive on windows?
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length);
    }
    return f;
  }


  function extname(path) {
    return splitPath(path)[3];
  }
  var path = {
    extname: extname,
    basename: basename,
    dirname: dirname,
    sep: sep,
    delimiter: delimiter,
    relative: relative,
    join: join,
    isAbsolute: isAbsolute,
    normalize: normalize$3,
    resolve: resolve
  };
  function filter$1 (xs, f) {
      if (xs.filter) return xs.filter(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
          if (f(xs[i], i, xs)) res.push(xs[i]);
      }
      return res;
  }

  // String.prototype.substr - negative index don't work in IE8
  var substr = 'ab'.substr(-1) === 'b' ?
      function (str, start, len) { return str.substr(start, len) } :
      function (str, start, len) {
          if (start < 0) start = str.length + start;
          return str.substr(start, len);
      }
  ;

  class gltfModelPathProvider
  {
      constructor(modelIndexerPath, currentFalvour="glTF", ignoredVariants = ["glTF-Embedded"])
      {
          this.modelIndexerPath = modelIndexerPath;
          this.ignoredVariants = ignoredVariants;
          this.modelsDictionary = undefined;
      }

      async initialize()
      {
          const self = this;
          return axios$3.get(this.modelIndexerPath).then(response =>
          {
              self.populateDictionary(response.data);
          });
      }

      resolve(modelKey, flavour)
      {
          return this.modelsDictionary[modelKey][flavour];
      }

      getAllKeys()
      {
          return Object.keys(this.modelsDictionary);
      }

      populateDictionary(modelIndexer)
      {
          const modelsFolder = path.dirname(this.modelIndexerPath);
          this.modelsDictionary = {};
          for (const entry of modelIndexer)
          {
              // TODO maybe handle undefined names better
              if (entry.variants === undefined || entry.name === undefined)
              {
                  continue;
              }

              let variants = [];

              for (const variant of Object.keys(entry.variants))
              {
                  if (this.ignoredVariants.includes(variant))
                  {
                      continue;
                  }

                  const fileName = entry.variants[variant];
                  const modelPath = path.join(modelsFolder, entry.name, variant, fileName);
                  variants[variant] = modelPath;

              }
              this.modelsDictionary[entry.name] = variants;
          }
      }

      getModelFlavours(modelName)
      {
          if(this.modelsDictionary[modelName] === undefined)
          {
              return ["glTF"];
          }
          return Object.keys(this.modelsDictionary[modelName]);
      }
  }

  function fillEnvironmentWithPaths(environmentNames, environmentsBasePath)
  {
      Object.keys(environmentNames).map(function(name, index) {
          const title = environmentNames[name];
          environmentNames[name] = {
              index: index,
              title: title,
              hdr_path: environmentsBasePath + name + ".hdr",
              jpg_path: environmentsBasePath + name + ".jpg"
          };
      });
      return environmentNames;
  }

  async function main()
  {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("webgl2", { alpha: false, antialias: true });
      const ui = document.getElementById("app");
      const view = new GltfView(context);
      const resourceLoader = view.createResourceLoader();
      const state = view.createState();
      state.renderingParameters.useDirectionalLightsWithDisabledIBL = true;

      const pathProvider = new gltfModelPathProvider('assets/models/2.0/model-index.json');
      await pathProvider.initialize();
      const environmentPaths = fillEnvironmentWithPaths({
          "footprint_court": "Footprint Court",
          "pisa": "Pisa",
          "doge2": "Doge's palace",
          "ennis": "Dining room",
          "field": "Field",
          "helipad": "Helipad Goldenhour",
          "papermill": "Papermill Ruins",
          "neutral": "Studio Neutral",
          "chromatic": "Studio Chromatic",
          "directional": "Studio Directional",
      }, "assets/environments/");

      const uiModel = new UIModel(app, pathProvider, environmentPaths);

      // whenever a new model is selected, load it and when complete pass the loaded gltf
      // into a stream back into the UI
      const gltfLoadedSubject = new Subject();
      const gltfLoadedMulticast = uiModel.model.pipe(
          mergeMap( (model) =>
          {
          	uiModel.goToLoadingState();
              return from(resourceLoader.loadGltf(model.mainFile, model.additionalFiles).then( (gltf) => {
                  state.gltf = gltf;
                  const defaultScene = state.gltf.scene;
                  state.sceneIndex = defaultScene === undefined ? 0 : defaultScene;
                  state.cameraIndex = undefined;
                  if (state.gltf.scenes.length != 0)
                  {
                      if(state.sceneIndex > state.gltf.scenes.length - 1)
                      {
                          state.sceneIndex = 0;
                      }
                      const scene = state.gltf.scenes[state.sceneIndex];
                      scene.applyTransformHierarchy(state.gltf);
                      state.userCamera.aspectRatio = canvas.width / canvas.height;
                      state.userCamera.fitViewToScene(state.gltf, state.sceneIndex);

                      // Try to start as many animations as possible without generating conficts.
                      state.animationIndices = [];
                      for (let i = 0; i < gltf.animations.length; i++)
                      {
                          if (!gltf.nonDisjointAnimations(state.animationIndices).includes(i))
                          {
                              state.animationIndices.push(i);
                          }
                      }
                      state.animationTimer.start();
                  }

                  uiModel.exitLoadingState();

                  return state;
              })
              );
          }),
          // transform gltf loaded observable to multicast observable to avoid multiple execution with multiple subscriptions
          multicast(gltfLoadedSubject)
      );

      uiModel.disabledAnimations(uiModel.activeAnimations.pipe(map(animationIndices => {
          // Disable all animations which are not disjoint to the current selection of animations.
          return state.gltf.nonDisjointAnimations(animationIndices);
      })));

      const sceneChangedSubject = new Subject();
      const sceneChangedObservable = uiModel.scene.pipe(map( newSceneIndex => {
          state.sceneIndex = newSceneIndex;
          state.cameraIndex = undefined;
          const scene = state.gltf.scenes[state.sceneIndex];
          if (scene !== undefined)
          {
              scene.applyTransformHierarchy(state.gltf);
              state.userCamera.fitViewToScene(state.gltf, state.sceneIndex);
          }
      }),
      multicast(sceneChangedSubject)
      );

      const statisticsUpdateObservableTemp = merge$1(
          gltfLoadedMulticast,
          sceneChangedObservable
      );

      const statisticsUpdateObservable = statisticsUpdateObservableTemp.pipe(
          map( (_) => view.gatherStatistics(state) )
      );

      const cameraExportChangedObservable = uiModel.cameraValuesExport.pipe( map(_ => {
          let camera = state.userCamera;
          if(state.cameraIndex !== undefined)
          {
              camera = state.gltf.cameras[state.cameraIndex];
          }
          const cameraDesc = camera.getDescription(state.gltf);
          return cameraDesc;
      }));

      const downloadDataURL = (filename, dataURL) => {
          var element = document.createElement('a');
          element.setAttribute('href', dataURL);
          element.setAttribute('download', filename);

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
      };

      cameraExportChangedObservable.subscribe( cameraDesc => {
          const gltf = JSON.stringify(cameraDesc, undefined, 4);
          const dataURL = 'data:text/plain;charset=utf-8,' +  encodeURIComponent(gltf);
          downloadDataURL("camera.gltf", dataURL);
      });

      uiModel.captureCanvas.subscribe( () => {
          view.renderFrame(state, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL();
          downloadDataURL("capture.png", dataURL);
      });

      uiModel.camera.pipe(filter(camera => camera === -1)).subscribe( () => {
          state.cameraIndex = undefined;
      });
      uiModel.camera.pipe(filter(camera => camera !== -1)).subscribe( camera => {
          state.cameraIndex = camera;
      });

      uiModel.variant.subscribe( variant => {
          state.variant = variant;
      });

      uiModel.tonemap.subscribe( tonemap => {
          state.renderingParameters.toneMap = tonemap;
      });

      uiModel.debugchannel.subscribe( debugchannel => {
          state.renderingParameters.debugOutput = debugchannel;
      });

      uiModel.skinningEnabled.subscribe( skinningEnabled => {
          state.renderingParameters.skinning = skinningEnabled;
      });

      uiModel.exposurecompensation.subscribe( exposurecompensation => {
          state.renderingParameters.exposure = Math.pow(2, exposurecompensation);
      });

      uiModel.morphingEnabled.subscribe( morphingEnabled => {
          state.renderingParameters.morphing = morphingEnabled;
      });

      uiModel.clearcoatEnabled.subscribe( clearcoatEnabled => {
          state.renderingParameters.enabledExtensions.KHR_materials_clearcoat = clearcoatEnabled;
      });
      uiModel.sheenEnabled.subscribe( sheenEnabled => {
          state.renderingParameters.enabledExtensions.KHR_materials_sheen = sheenEnabled;
      });
      uiModel.transmissionEnabled.subscribe( transmissionEnabled => {
          state.renderingParameters.enabledExtensions.KHR_materials_transmission = transmissionEnabled;
      });
      uiModel.volumeEnabled.subscribe( volumeEnabled => {
          state.renderingParameters.enabledExtensions.KHR_materials_volume = volumeEnabled;
      });
      uiModel.iorEnabled.subscribe( iorEnabled => {
          state.renderingParameters.enabledExtensions.KHR_materials_ior = iorEnabled;
      });
      uiModel.specularEnabled.subscribe( specularEnabled => {
          state.renderingParameters.enabledExtensions.KHR_materials_specular = specularEnabled;
      });

      uiModel.iblEnabled.subscribe( iblEnabled => {
          state.renderingParameters.useIBL = iblEnabled;
      });

      uiModel.renderEnvEnabled.subscribe( renderEnvEnabled => {
          state.renderingParameters.renderEnvironmentMap = renderEnvEnabled;
      });
      uiModel.blurEnvEnabled.subscribe( blurEnvEnabled => {
          state.renderingParameters.blurEnvironmentMap = blurEnvEnabled;
      });

      uiModel.punctualLightsEnabled.subscribe( punctualLightsEnabled => {
          state.renderingParameters.usePunctual = punctualLightsEnabled;
      });

      uiModel.environmentRotation.subscribe( environmentRotation => {
          switch (environmentRotation)
          {
          case "+Z":
              state.renderingParameters.environmentRotation = 90.0;
              break;
          case "-X":
              state.renderingParameters.environmentRotation = 180.0;
              break;
          case "-Z":
              state.renderingParameters.environmentRotation = 270.0;
              break;
          case "+X":
              state.renderingParameters.environmentRotation = 0.0;
              break;
          }
      });


      uiModel.clearColor.subscribe( clearColor => {
          state.renderingParameters.clearColor = clearColor;
      });

      uiModel.animationPlay.subscribe( animationPlay => {
          if(animationPlay)
          {
              state.animationTimer.unpause();
          }
          else
          {
              state.animationTimer.pause();
          }
      });

      uiModel.activeAnimations.subscribe( animations => {
          state.animationIndices = animations;
      });

      uiModel.hdr.subscribe( hdrFile => {
          resourceLoader.loadEnvironment(hdrFile).then( (environment) => {
              state.environment = environment;
          });
      });

      uiModel.attachGltfLoaded(gltfLoadedMulticast);
      uiModel.updateStatistics(statisticsUpdateObservable);
      const sceneChangedStateObservable = uiModel.scene.pipe(map( newSceneIndex => state));
      uiModel.attachCameraChangeObservable(sceneChangedStateObservable);
      gltfLoadedMulticast.connect();

      uiModel.orbit.subscribe( orbit => {
          if (state.cameraIndex === undefined)
          {
              state.userCamera.orbit(orbit.deltaPhi, orbit.deltaTheta);
          }
      });

      uiModel.pan.subscribe( pan => {
          if (state.cameraIndex === undefined)
          {
              state.userCamera.pan(pan.deltaX, -pan.deltaY);
          }
      });

      uiModel.zoom.subscribe( zoom => {
          if (state.cameraIndex === undefined)
          {
              state.userCamera.zoomBy(zoom.deltaZoom);
          }
      });

      // configure the animation loop
      const update = () =>
      {
          canvas.width = window.innerWidth - ui.getBoundingClientRect().width;
          canvas.height = window.innerHeight;

          view.renderFrame(state, canvas.width, canvas.height);
          window.requestAnimationFrame(update);
      };

      // After this start executing animation loop.
      window.requestAnimationFrame(update);
  }

  exports.main = main;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=GltfSVApp.umd.js.map

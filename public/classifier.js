var SVC = function(nClasses, nRows, vectors, coefficients, intercepts, weights, kernel, gamma, coef0, degree) {

    this.nClasses = nClasses;
    this.classes = ['Resting', 'Walking', 'Jumping'];
    this.nRows = nRows;
    this.vectors = vectors;
    this.coefficients = coefficients;
    this.intercepts = intercepts;
    this.weights = weights;
    this.kernel = kernel.toUpperCase();
    this.gamma = gamma;
    this.coef0 = coef0;
    this.degree = degree;

    this.predict = function(features) {

        var kernels = new Array(vectors.length);
        var kernel;
        switch (this.kernel) {
            case 'LINEAR':
                // <x,x'>
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += this.vectors[i][j] * features[j];
                    }
                    kernels[i] = kernel;
                }
                break;
            case 'POLY':
                // (y<x,x'>+r)^d
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += this.vectors[i][j] * features[j];
                    }
                    kernels[i] = Math.pow((this.gamma * kernel) + this.coef0, this.degree);
                }
                break;
            case 'RBF':
                // exp(-y|x-x'|^2)
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += Math.pow(this.vectors[i][j] - features[j], 2);
                    }
                    kernels[i] = Math.exp(-this.gamma * kernel);
                }
                break;
            case 'SIGMOID':
                // tanh(y<x,x'>+r)
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += this.vectors[i][j] * features[j];
                    }
                    kernels[i] = Math.tanh((this.gamma * kernel) + this.coef0);
                }
                break;
        }

        var starts = new Array(this.nRows);
        for (var i = 0; i < this.nRows; i++) {
            if (i != 0) {
                var start = 0;
                for (var j = 0; j < i; j++) {
                    start += this.weights[j];
                }
                starts[i] = start;
            } else {
                starts[0] = 0;
            }
        }

        var ends = new Array(this.nRows);
        for (var i = 0; i < this.nRows; i++) {
            ends[i] = this.weights[i] + starts[i];
        }

        if (this.nClasses == 2) {

            for (var i = 0; i < kernels.length; i++) {
                kernels[i] = -kernels[i];
            }

            var decision = 0.;
            for (var k = starts[1]; k < ends[1]; k++) {
                decision += kernels[k] * this.coefficients[0][k];
            }
            for (var k = starts[0]; k < ends[0]; k++) {
                decision += kernels[k] * this.coefficients[0][k];
            }
            decision += this.intercepts[0];

            if (decision > 0) {
                return 0;
            }
            return 1;

        }

        var decisions = new Array(this.intercepts.length);
        for (var i = 0, d = 0, l = this.nRows; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                var tmp = 0.;
                for (var k = starts[j]; k < ends[j]; k++) {
                    tmp += this.coefficients[i][k] * kernels[k];
                }
                for (var k = starts[i]; k < ends[i]; k++) {
                    tmp += this.coefficients[j - 1][k] * kernels[k];
                }
                decisions[d] = tmp + this.intercepts[d];
                d++;
            }
        }

        var votes = new Array(this.intercepts.length);
        for (var i = 0, d = 0, l = this.nRows; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                votes[d] = decisions[d] > 0 ? i : j;
                d++;
            }
        }

        var amounts = new Array(this.nClasses).fill(0);
        for (var i = 0, l = votes.length; i < l; i++) {
            amounts[votes[i]] += 1;
        }

        var classVal = -1, classIdx = -1;
        for (var i = 0, l = amounts.length; i < l; i++) {
            if (amounts[i] > classVal) {
                classVal = amounts[i];
                classIdx= i;
            }
        }
        return this.classes[classIdx];

    }

};

if (true) {
    if (true) {

        // Features:
        var features = [0,0,0];

        // Parameters:
        var vectors = [[-0.6387374252080917, 3.0622507280324416, 0.05739160522052543], [29.953560733795165, 12063.132436483076, 14.15776917720928], [4.931549525260925, 40.085794202482745, 0.2081499089202481], [-121.03178215026855, 1914.869586349569, 1.6075809576415636], [10.752444553375245, 8538.880602006786, 31.43796606102885], [25.507795077934862, 3843.0700593015413, 89.31988925090695], [29.81000590324402, 14691.742653438203, 3.208771236576665]];
        var coefficients = [[0.0014267435903233198, -0.0, -0.0014267435903233198, -0.0, -0.0, -1.3555359977496336e-07, -0.0], [1.3555359977496336e-07, 0.12460178797977506, 0.0, 0.006856687100116333, -0.06746995099010004, -0.0, -0.0639885240897949]];
        var intercepts = [1.1566936411117874, 1.0015924143620363, 40.81029743462273];
        var weights = [1, 3, 3];

        // Prediction:
        var clf = new SVC(3, 3, vectors, coefficients, intercepts, weights, "linear", "auto_deprecated", 0.0, 3);
        var prediction = clf.predict(features);
        console.log(prediction);

    }
}

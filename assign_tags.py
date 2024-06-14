from openai import OpenAI
client = OpenAI()

## Sample lessons to test; don't need this 
lessons = [

["'This lesson introduces students to the concept of' '. They use what they learned about area of rectangles to find the surface area of prisms with rectangular', 'Students begin exploring surface area in concrete terms, by estimating\xa0and then calculating\xa0the number of square sticky notes it would take to cover a filing cabinet. Because students are not\xa0given specific techniques ahead of time, they need to\xa0make sense of the problem and persevere in solving it (MP1). The first activity is meant to be open and exploratory. In the second activity, they then learn that the surface area (in square units) is the number of unit squares it takes to cover all the surfaces of a three-dimensional figure without gaps or overlaps (MP6).', 'Later in the lesson, students use cubes to\xa0build rectangular prisms and then determine their surface areas.'"],

["'The purpose of this lesson is to develop students ability to work with a table of equivalent ratios. It also provides opportunities to compare and contrast different ways of solving equivalent ratio problems.', 'Students see that a table accommodates different ways of reasoning about equivalent ratios, with some being more direct than others. They notice (MP8) that to find an unknown quantity, they can:', 'All tasks in the lesson aim to strengthen students understanding of the multiplicative relationships between equivalent ratios—that given a ratio', ', an equivalent ratio may be found by multiplying both', 'and', 'by the same factor. They also aim to build students awareness of how a table can facilitate this reasoning to varying degrees of efficiency, depending on one’s approach.', 'Ultimately, the goal of this unit is to prepare students to make sense of situations involving equivalent ratios and solve problems flexibly and strategically, rather than to rely on a procedure (such as “set up a proportion and cross multiply”) without an understanding of the underlying mathematics.', 'To reason using ratios in which one of the quantities is 1, students are likely to use division. In the example above, they are likely to divide the 90 by 5 to obtain the amount earned per hour. Remind students that dividing by a whole number is the same as multiplying by its reciprocal (a unit fraction) and encourage the use of multiplication (as shown in the activity about hourly wages) whenever possible. Doing so will better prepare students to: 1) scale down, i.e., to find equivalent ratios involving values that are smaller than the given ones, 2) relate fractions to percentages later in the course, and 3) understand division of fractions (including the “invert and multiply” rule) in a later unit.'"],

["'This is the second of two lessons that help students make sense of equivalent ratios through physical experiences. In this lesson, students mix different numbers of batches of a recipe for green water by combining blue and yellow water (created ahead of time with food coloring) to see if they produce the same shade of green. They also change the ratio of blue and yellow water to see if it changes the result. The activities here reinforce the idea that scaling a recipe up (or down) requires scaling the amount of each ingredient by the same factor (MP7). Students continue to use discrete diagrams as a tool to represent a situation.', 'For students who do not see color, the lesson can be adapted by having students make batches of dough with flour and water. 1 cup of flour to 5 tablespoons of water makes a very stiff dough, and 1 cup of flour to 6 tablespoons of water makes a soft (but not sticky) dough. In this case, doubling a recipe yields dough with the same tactile properties, just as doubling a colored-water recipe yields a mixture with the same color. The invariant property is stiffness rather than color. The principle that equivalent ratios yield products that are identical in some important way applies to both types of experiments.'"],

["'Students have practiced solving three different types of percentage problems (corresponding to finding', ',', ', or', 'respectively when', 'of', 'is', '). This lesson focuses on finding “', 'of', '” as efficiently as possible. While the previous lesson used numbers that students could calculate mentally, the numbers in this lesson are purposefully chosen to be difficult for students to calculate mentally or to represent on a double number line diagram, so as to motivate them to find the simplest way to do the calculation by hand.', 'The third activity hints at work students will do in grade 7, namely finding a constant of proportionality and writing an equation to represent a proportional relationship.'"],

["'This lesson builds on students work on area and fractions in grade 5. Students solve problems involving the relationship between area and side lengths of rectangles, in cases where these measurements can be fractions. Knowing that the area of a rectangle can be found by multiplying its side lengths, and knowing the relationship between multiplication and division, they use division to find an unknown side length when the other side length and the area are given.'"],

["'In previous lessons students have calculated and worked with rates per 1. The purpose of this lesson is to introduce the two', ',', 'and', ', associated with a ratio', '. Each unit rate tells us how many of one quantity in the ratio there is per unit of the other quantity.\An important goal is to give students the opportunity to see that both unit rates describe the same situation, but that one or the other might be preferable for answering a given question about the situation. Another goal is for students to recognize that they can just divide one number in a ratio by another to find a unit rate, rather than using a table or another representation as an intermediate step. The development of such fluency begins in this section and continues over time. In the Cooking Oatmeal activity, students have\xa0explicit opportunities to justify their reasoning and critique the reasoning of others (MP3).'"],

["'In the previous three lessons, students explored the “how many groups?” interpretation of division. Their explorations included situations where the number of groups was a whole number or a mixed number. In this lesson, they extend the work to include cases where the number of groups is a fraction less than 1, that is, situations in which the total amount is smaller than the size of 1 group. In such situations, the question becomes “what fraction of a group?”.', 'Students notice that they can use the same reasoning strategies as in situations with a whole number of groups, because the structure', 'is the same as before (MP7). They write multiplication equations of this form and for the corresponding division equations.', 'Throughout the lesson, students practice attending to details (in diagrams, descriptions, or equations) about how the given quantities relate to the size of 1 group.'"],

["'This lesson serves two purposes. The first is to show that we can divide a decimal by a whole number the same way we divide two whole numbers. Students first represent a decimal dividend with base-ten diagrams. They see that, just like the units representing powers of 10, those for powers of 0.1 can also be divided into groups. They then divide using another method—partial quotients or long division—and notice that the principle of placing base-ten units into equal-size groups is likewise applicable.', 'The second is to uncover the idea that the value of a quotient does not change if both the divisor and dividend are multiplied by the same factor. Students begin exploring this idea in problems where the factor is a multiple of 10 (e.g.', '). This work prepares students to divide two decimals in the next lesson.'"],

["'In this lesson, students consolidate their equation writing and solving skills.\xa0In the first activity they\xa0solve a variety of equations with different structures, and in the second they work to match equations to situations and solve them. Students may choose any strategy to solve equations, including drawing diagrams to reason about unknown quantities, looking at the structure of the equation, or doing the same thing\xa0to each side of the equation. They choose efficient tools and strategies for specific problems. This will help students develop flexibility and fluency in writing and solving equations.'"],

["'In this lesson, students encounter expressions and equations with variables that also involve exponents. Students first evaluate expressions for given values of their variables. They learn that multiplication can be expressed without a dot or other symbol by placing a number, known as a coefficient, next to a variable or variable expression. In the next activity, students are presented with equations that\xa0contain a variable. They\xa0engage in\xa0MP7 by considering the structure of the equations and apply their understanding of exponents and operations to select a number from a list that, when replaced for the\xa0variable, makes the equation true. That number is a solution of the equation.'"],

["'In this lesson, students use precise language to distinguish between order and absolute value of rational numbers (MP6). It is a common mistake for students to mix up “greater” or “less” with absolute value. A confused student might say that -18 is greater than 4 because they see 18 as being the “bigger” number. What this student means to express is', '. The', 'of -18 is greater than 4 because -18 is more than 4 units away from 0. In the “Submarine” activity, students visualize possible elevations of characters with sticky notes on a vertical number line. The freedom to move a sticky note within a specified range anticipates the concept of a solution to an inequality in the next section.'"]


]

#Just forcing it to choose from existing tags, does quite well 
for lesson in lessons:
  completion = client.chat.completions.create(
    model="gpt-4-turbo-2024-04-09",
    messages=[
      {"role": "system", "content": "You are a model with a high level of pedalogical expertise in middle school mathematics." },
      {"role": "user", "content": 
      f""" You will be given an example of a lesson or worksheet that is to be given to sixth grade math students, your job is 
            to correctly tag said worksheet with the corresponding common core standard. These standards will be listed below, alongside a description of what topics they cover
            The format of these tags will be [grade level].[topic].[subtopic] (there can be subtopics within the subtopics). 
            Since the lesson / worksheet is for sixth grade students, you can assume the tag will begin with 6 as the grade level.
            
            Here are the acronyms used to describe topics:
            RP = Ratios and Proportional Relationships
            NS = The Number System
            EE = Expressions and Equations
            G = Geometry
            SP = Statistics and Probability

            Now, here are all the possible tags and a description:

  6.RP.A. Understand ratio concepts and use ratio reasoning to solve problems.
  6.RP.A.1. Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities. For example, “The ratio of wings to beaks in the bird house at the zoo was 2:1, because for every 2 wings there was 1 beak.” “For every vote candidate A received, candidate C received nearly three votes.”
  6.RP.A.2. Understand the concept of a unit rate a/b associated with a ratio a:b with b≠0, and use rate language in the context of a ratio relationship. For example, “This recipe has a ratio of 3 cups of flour to 4 cups of sugar, so there is 3/4 cup of flour for each cup of sugar.” “We paid $75 for 15 hamburgers, which is a rate of $5 per hamburger.”
  6.RP.A.3. Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.
  6.RP.A.3.a. Make tables of equivalent ratios relating quantities with whole-number measurements, find missing values in the tables, and plot the pairs of values on the coordinate plane. Use tables to compare ratios.
  6.RP.A.3.b. Solve unit rate problems including those involving unit pricing and constant speed. For example, if it took 7 hours to mow 4 lawns, then at that rate, how many lawns could be mowed in 35 hours? At what rate were lawns being mowed?
  6.RP.A.3.c. Find a percent of a quantity as a rate per 100 (e.g., 30% of a quantity means 30/100 times the quantity); solve problems involving finding the whole, given a part and the percent.
  6.RP.A.3.d. Use ratio reasoning to convert measurement units; manipulate and transform units appropriately when multiplying or dividing quantities.

  6.NS.A. Apply and extend previous understandings of multiplication and division to divide fractions by fractions.
  6.NS.A.1. Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions, e.g., by using visual fraction models and equations to represent the problem. For example, create a story context for (2/3)÷(3/4) and use a visual fraction model to show the quotient; use the relationship between multiplication and division to explain that (2/3)÷(3/4)=8/9 because 3/4 of 8/9 is 2/3. (In general, (a/b)÷(c/d)=ad/bc.) How much chocolate will each person get if 3 people share 1/2 lb of chocolate equally? How many 3/4-cup servings are in 2/3 of a cup of yogurt? How wide is a rectangular strip of land with length 3/4 mi and area 1/2 square mi?
  6.NS.B.2. Fluently divide multi-digit numbers using the standard algorithm.
  6.NS.B.3. Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.
  6.NS.B.4. Find the greatest common factor of two whole numbers less than or equal to 100 and the least common multiple of two whole numbers less than or equal to 12. Use the distributive property to express a sum of two whole numbers 1–100 with a common factor as a multiple of a sum of two whole numbers with no common factor. For example, express 36+8 as 4(9+2).


  6.NS.C. Apply and extend previous understandings of numbers to the system of rational numbers.

  6.NS.C.5. Understand that positive and negative numbers are used together to describe quantities having opposite directions or values (e.g., temperature above/below zero, elevation above/below sea level, credits/debits, positive/negative electric charge); use positive and negative numbers to represent quantities in real-world contexts, explaining the meaning of 0 in each situation.

  6.NS.C.6. Understand a rational number as a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.

  6.NS.C.6.a. Recognize opposite signs of numbers as indicating locations on opposite sides of 0 on the number line; recognize that the opposite of the opposite of a number is the number itself, e.g., −(−3)=3, and that 0 is its own opposite.

  Integers on the Number Line 2
  6.NS.C.6.b. Understand signs of numbers in ordered pairs as indicating locations in quadrants of the coordinate plane; recognize that when two ordered pairs differ only by signs, the locations of the points are related by reflections across one or both axes.
  6.NS.C.6.c. Find and position integers and other rational numbers on a horizontal or vertical number line diagram; find and position pairs of integers and other rational numbers on a coordinate plane.
  6.NS.C.7. Understand ordering and absolute value of rational numbers.
  6.NS.C.7.a. Interpret statements of inequality as statements about the relative position of two numbers on a number line diagram. For example, interpret −3>−7 as a statement that −3 is located to the right of −7 on a number line oriented from left to right.
  6.NS.C.7.b. Write, interpret, and explain statements of order for rational numbers in real-world contexts. For example, write −3∘C>−7∘C to express the fact that −3∘C is warmer than −7∘C.
  6.NS.C.7.c. Understand the absolute value of a rational number as its distance from 0 on the number line; interpret absolute value as magnitude for a positive or negative quantity in a real-world situation. For example, for an account balance of −30 dollars, write |−30|=30 to describe the size of the debt in dollars.
  6.NS.C.7.d. Distinguish comparisons of absolute value from statements about order. For example, recognize that an account balance less than −30 dollars represents a debt greater than 30 dollars.
  6.NS.C.8. Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane. Include use of coordinates and absolute value to find distances between points with the same first coordinate or the same second coordinate.


  6.EE.A. Apply and extend previous understandings of arithmetic to algebraic expressions.
  6.EE.A.1. Write and evaluate numerical expressions involving whole-number exponents.
  6.EE.A.2. Write, read, and evaluate expressions in which letters stand for numbers.
  6.EE.A.2.a. Write expressions that record operations with numbers and with letters standing for numbers. For example, express the calculation “Subtract y from 5” as 5−y.
  6.EE.A.2.b. Identify parts of an expression using mathematical terms (sum, term, product, factor, quotient, coefficient); view one or more parts of an expression as a single entity. For example, describe the expression 2(8+7) as a product of two factors; view (8+7) as both a single entity and a sum of two terms.

  No tasks yet illustrate this standard.
  6.EE.A.2.c. Evaluate expressions at specific values of their variables. Include expressions that arise from formulas used in real-world problems. Perform arithmetic operations, including those involving whole-number exponents, in the conventional order when there are no parentheses to specify a particular order (Order of Operations). For example, use the formulas V=s3 and A=6s2 to find the volume and surface area of a cube with sides of length s=1/2.
  6.EE.A.3. Apply the properties of operations to generate equivalent expressions. For example, apply the distributive property to the expression 3(2+x) to produce the equivalent expression 6+3x; apply the distributive property to the expression 24x+18y to produce the equivalent expression 6(4x+3y); apply properties of operations to y+y+y to produce the equivalent expression 3y.
  6.EE.A.4. Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them). For example, the expressions y+y+y and 3y are equivalent because they name the same number regardless of which number y stands for.

  6.EE.B. Reason about and solve one-variable equations and inequalities.
  6.EE.B.5. Understand solving an equation or inequality as a process of answering a question: which values from a specified set, if any, make the equation or inequality true? Use substitution to determine whether a given number in a specified set makes an equation or inequality true.
  6.EE.B.6. Use variables to represent numbers and write expressions when solving a real-world or mathematical problem; understand that a variable can represent an unknown number, or, depending on the purpose at hand, any number in a specified set.
  6.EE.B.7. Solve real-world and mathematical problems by writing and solving equations of the form x+p=q and px=q for cases in which p, q and x are all nonnegative rational numbers.
  6.EE.B.8. Write an inequality of the form x>c or x<c to represent a constraint or condition in a real-world or mathematical problem. Recognize that inequalities of the form x>c or x<c have infinitely many solutions; represent solutions of such inequalities on number line diagrams.

  6.EE.C. Represent and analyze quantitative relationships between dependent and independent variables.
  6.EE.C.9. Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable. Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation. For example, in a problem involving motion at constant speed, list and graph ordered pairs of distances and times, and write the equation d=65t to represent the relationship between distance and time.

  6.G.A. Solve real-world and mathematical problems involving area, surface area, and volume.
  6.G.A.1. Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems.
  6.G.A.2. Find the volume of a right rectangular prism with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism. Apply the formulas V=lwh and V=bh to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems.
  6.G.A.3. Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate. Apply these techniques in the context of solving real-world and mathematical problems.
  6.G.A.4. Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures. Apply these techniques in the context of solving real-world and mathematical problems.

  6.SP.A. Develop understanding of statistical variability.
  6.SP.A.1. Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers. For example, “How old am I?” is not a statistical question, but “How old are the students in my school?” is a statistical question because one anticipates variability in students' ages.
  6.SP.A.2. Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.
  6.SP.A.3. Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.

  6.SP.B. Summarize and describe distributions.
  6.SP.B.4. Display numerical data in plots on a number line, including dot plots, histograms, and box plots.
  6.SP.B.5. Summarize numerical data sets in relation to their context, such as by:
  6.SP.B.5.a. Reporting the number of observations.
  6.SP.B.5.b. Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.
  6.SP.B.5.c. Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.
  6.SP.B.5.d. Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.

  Given the following lesson, pick one of these tags. Only pick these tags, do not create your own. No need to give an explanation either, just the tag.

  Here is the lesson: {[lesson]}
  """}
    ]
  )
  print(completion.choices[0].message)  




